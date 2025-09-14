# schedule_runner.py
import os
from datetime import datetime
from pprint import pprint

from rag import RourkelalTourismSchedulePlanner
from place_recommender import LatLngSchedulePlanner  # your LatLngSchedulePlanner/GeoDayPlanner file

def run():
    planner = RourkelalTourismSchedulePlanner(
        api_key=os.getenv("GEMINI_API_KEY"),
        weather_api_key=os.getenv("WHEATHER_KEY"),
        attractions_file="rag.json",
        restaurants_file="restaurants_rourkela.json",
        model_file="rkl_places_xgb.pkl"
    )

    geo = LatLngSchedulePlanner(
        planner,
        default_radius_km=8.0,
        dwell_minutes=60,
        travel_speed_kmh=20.0
    )

    lat, lng = 22.2396, 84.8633  # city center (adjust if needed)
    day_plan = geo.plan_day(
        lat=lat,
        lng=lng,
        date=datetime.now(),
        radius_km=8.0,
        max_stops=6,
        start_hour=8,
        end_hour=20
    )

    print("=== STRUCTURED SCHEDULE ===")
    for s in day_plan["schedule"]:
        travel = f" • travel {s['travel_min_from_prev']} min" if "travel_min_from_prev" in s else ""
        print(f"{s['time']} • {s['place']} • score={s['score']} • crowd={s['crowd']}%{travel}")

    print("\n=== WEATHER SUMMARY ===")
    print(day_plan["weather_summary"])

    if day_plan.get("nearby_places"):
        print("\n=== NEARBY PLACES ===")
        for p in day_plan["nearby_places"]:
            print(f"{p['title']} ({p['distance_km']} km)")

    try:
        stops_text = ", ".join([f"{s['time']} {s['place']}" for s in day_plan["schedule"]])
        query = (
            "Create a concise itinerary paragraph for these stops with brief highlights drawn from context. "
            "Keep place names exactly as listed and reflect expected crowd levels if relevant: "
            f"{stops_text}"
        )
        out = planner.qa_chain({"query": query})
        print("\n=== RAG NARRATIVE ===")
        print(out["result"])
    except Exception as e:
        print(f"\n[Skipped RAG narrative: {e}]")

if __name__ == "__main__":
    run()
