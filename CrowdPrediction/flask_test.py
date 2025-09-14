# app.py
import os
from datetime import datetime
from flask import Flask, request, jsonify
from dotenv import load_dotenv

from rag import RourkelalTourismSchedulePlanner
from place_recommender import LatLngSchedulePlanner

load_dotenv()
app = Flask(__name__)

_PLANNER = None
_GEO = None

def _get_env(key: str, default: str | None = None):
    v = os.getenv(key)
    if v is None and key == "WEATHER_KEY":
        v = os.getenv("WHEATHER_KEY", default)
    return v if v is not None else default

def _parse_datetime(val: str | None) -> datetime:
    if not val:
        return datetime.now()
    try:
        return datetime.fromisoformat(val.replace("Z", ""))
    except Exception:
        return datetime.now()

def _parse_float(name: str, value):
    try:
        return float(value)
    except Exception:
        raise ValueError(f"Invalid {name}: {value!r}")

def _require_lat_lng():
    # accept JSON body or query params
    data = request.get_json(silent=True) or {}
    lat_val = data.get("lat") if "lat" in data else request.args.get("lat")
    lng_val = data.get("lng") if "lng" in data else request.args.get("lng")

    if lat_val is None or lng_val is None:
        raise ValueError("Both 'lat' and 'lng' are required.")

    lat = _parse_float("lat", lat_val)
    lng = _parse_float("lng", lng_val)

    if not (-90.0 <= lat <= 90.0):
        raise ValueError(f"lat out of range [-90,90]: {lat}")
    if not (-180.0 <= lng <= 180.0):
        raise ValueError(f"lng out of range [-180,180]: {lng}")

    # optional params
    date_str = data.get("date", request.args.get("date"))
    radius_km = data.get("radius_km", request.args.get("radius_km", 8.0))
    max_stops = data.get("max_stops", request.args.get("max_stops", 6))
    start_hour = data.get("start_hour", request.args.get("start_hour", 8))
    end_hour = data.get("end_hour", request.args.get("end_hour", 20))
    include_rag = data.get("include_rag", request.args.get("include_rag", "true"))

    return {
        "lat": lat,
        "lng": lng,
        "date": _parse_datetime(str(date_str) if date_str is not None else None),
        "radius_km": float(radius_km),
        "max_stops": int(max_stops),
        "start_hour": int(start_hour),
        "end_hour": int(end_hour),
        "include_rag": str(include_rag).lower() not in ("false", "0", "no"),
    }

def get_services():
    global _PLANNER, _GEO
    if _PLANNER is None:
        _PLANNER = RourkelalTourismSchedulePlanner(
            api_key=_get_env("GEMINI_API_KEY"),
            weather_api_key=_get_env("WEATHER_KEY"),
            attractions_file=os.getenv("ATTRACTIONS_FILE", "rag.json"),
            restaurants_file=os.getenv("RESTAURANTS_FILE", "restaurants_rourkela.json"),
            model_file=os.getenv("MODEL_FILE", "rkl_places_xgb.pkl"),
        )
    if _GEO is None:
        _GEO = LatLngSchedulePlanner(
            _PLANNER,
            default_radius_km=float(os.getenv("DEFAULT_RADIUS_KM", "8.0")),
            dwell_minutes=int(os.getenv("DWELL_MINUTES", "60")),
            travel_speed_kmh=float(os.getenv("TRAVEL_SPEED_KMH", "20.0")),
        )
    return _PLANNER, _GEO

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/schedule", methods=["GET", "POST"])
def schedule():
    try:
        args = _require_lat_lng()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    p, geo = get_services()

    try:
        plan = geo.plan_day(
            lat=args["lat"],
            lng=args["lng"],
            date=args["date"],
            radius_km=args["radius_km"],
            max_stops=args["max_stops"],
            start_hour=args["start_hour"],
            end_hour=args["end_hour"],
            include_nearby=True,
        )
    except Exception as e:
        return jsonify({"error": f"failed_to_build_schedule: {e}"}), 500

    if args["include_rag"]:
        try:
            stops_text = ", ".join([f"{s['time']} {s['place']}" for s in plan.get("schedule", [])])
            query = (
                "Create a concise itinerary paragraph for these stops with brief highlights drawn from context. "
                "Keep place names exactly as listed and reflect expected crowd levels if relevant: "
                f"{stops_text}"
            )
            out = p.qa_chain({"query": query})
            plan["rag_narrative"] = out.get("result", "")
        except Exception as e:
            plan["rag_narrative_error"] = str(e)

    return jsonify(plan)

@app.get("/")
def index():
    return jsonify({
        "message": "Rourkela Trip Planner API",
        "usage": {
            "GET/POST /schedule": {
                "required": {"lat": "float", "lng": "float"},
                "optional": {
                    "date": "ISO string (default now)",
                    "radius_km": "float (default 8.0)",
                    "max_stops": "int (default 6)",
                    "start_hour": "int (default 8)",
                    "end_hour": "int (default 20)",
                    "include_rag": "bool (default true)"
                }
            }
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
