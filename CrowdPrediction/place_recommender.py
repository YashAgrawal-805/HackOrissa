import math
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import os
from rag import RourkelalTourismSchedulePlanner

class LatLngSchedulePlanner:
    def __init__(self, planner: "RourkelalTourismSchedulePlanner",
                 default_radius_km: float = 6.0,
                 dwell_minutes: int = 60,
                 travel_speed_kmh: float = 20.0):
        self.p = planner
        self.default_radius_km = float(default_radius_km)
        self.dwell_minutes = int(dwell_minutes)
        self.travel_speed_kmh = float(travel_speed_kmh)

    def _haversine_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        p1, p2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlmb = math.radians(lon2 - lon1)
        a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dlmb/2)**2
        return 2 * R * math.asin(math.sqrt(a))

    def _coords_for(self, key: str) -> Optional[tuple]:
        place = self.p.places_data.get(key)
        if not place: return None
        lat, lng = place.get("lat"), place.get("lng")
        try:
            return float(lat), float(lng)
        except Exception:
            return None

    def _travel_minutes(self, a: str, b: str) -> Optional[int]:
        ca = self._coords_for(a); cb = self._coords_for(b)
        if not ca or not cb: return None
        km = self._haversine_km(ca[0], ca[1], cb[0], cb[1])
        return int(math.ceil((km / max(1e-6, self.travel_speed_kmh)) * 60.0))

    def _weather_for_latlng(self, lat: float, lng: float, days: int = 1) -> Dict[str, Any]:
        key = self.p.weather_api_key
        if not key:
            return {"forecast": [], "source": "none", "location": f"{lat:.3f},{lng:.3f}"}
        try:
            url = "https://api.weatherapi.com/v1/forecast.json"
            params = {"key": key, "q": f"{lat},{lng}", "days": days, "aqi": "no", "alerts": "no"}
            r = requests.get(url, params=params, timeout=10); r.raise_for_status()
            data = r.json()
            forecast: List[Dict[str, Any]] = []
            for day in data.get("forecast", {}).get("forecastday", []):
                for hr in day.get("hour", []):
                    ts = hr.get("time_epoch")
                    dt = datetime.fromtimestamp(ts) if ts else datetime.now()
                    forecast.append({
                        "datetime": dt,
                        "temperature": hr.get("temp_c"),
                        "feels_like": hr.get("feelslike_c"),
                        "humidity": hr.get("humidity"),
                        "description": (hr.get("condition") or {}).get("text", "").lower(),
                        "rain": hr.get("precip_mm", 0.0),
                        "wind_speed": hr.get("wind_kph", 0.0),
                    })
            current = data.get("current", {})
            return {
                "current": {
                    "temperature": current.get("temp_c"),
                    "feels_like": current.get("feelslike_c"),
                    "humidity": current.get("humidity"),
                    "condition": (current.get("condition") or {}).get("text", "").lower() if current else "",
                },
                "forecast": forecast,
                "source": "weatherapi",
                "location": f"{lat:.3f},{lng:.3f}",
            }
        except Exception:
            return {"forecast": [], "source": "error", "location": f"{lat:.3f},{lng:.3f}"}

    def plan_day(self,
                 lat: float,
                 lng: float,
                 date: Optional[datetime] = None,
                 radius_km: Optional[float] = None,
                 include_nearby: bool = True,
                 max_stops: int = 4,
                 start_hour: int = 8,
                 end_hour: int = 20) -> Dict[str, Any]:
        date = date or datetime.now()
        radius = float(radius_km or self.default_radius_km)

        wx = self._weather_for_latlng(lat, lng, days=1)
        todays = [f for f in wx.get("forecast", []) if f.get("datetime") and f["datetime"].date() == date.date()]
        if todays:
            avg_t = sum([f["temperature"] for f in todays if f.get("temperature") is not None]) / max(1, len([f for f in todays if f.get("temperature") is not None]))
            rain = sum(f.get("rain", 0.0) for f in todays)
            desc = todays[0].get("description", "") or ""
            weather_summary = f"{avg_t:.1f}°C, rain={rain:.1f}mm, {desc}"
        else:
            weather_summary = "No hourly forecast."

        if hasattr(self.p, "find_nearby_places"):
            nearby = self.p.find_nearby_places(lat, lng, radius_km=radius, kind="attraction", limit=24)
        else:
            nearby = []
            for item in (self.p.attractions_data or []):
                plat, plng = item.get("lat"), item.get("lng")
                if plat is None or plng is None: continue
                try:
                    d = self._haversine_km(float(plat), float(plng), lat, lng)
                except Exception:
                    continue
                if d <= radius:
                    nearby.append({"id": item.get("id"), "title": item.get("title"), "lat": float(plat), "lng": float(plng), "distance_km": round(d, 2)})
            nearby.sort(key=lambda r: r["distance_km"]); nearby = nearby[:24]

        candidates: List[Dict[str, Any]] = []
        for place in nearby:
            key = place.get("title") or place.get("id")
            if not key: continue
            try:
                recs = self.p.recommend_visit_times(key, date=date, start_hour=start_hour, end_hour=end_hour, step_minutes=60, top_k=2)
            except AttributeError:
                pred = self.p.predict_crowd_level(key, date.replace(hour=start_hour))
                recs = [{
                    "place": key,
                    "time": date.replace(hour=start_hour).strftime("%Y-%m-%d %I:%M %p"),
                    "score": 60,
                    "crowd_level": pred["crowd_level"],
                    "label": "Balanced",
                    "reasons": ["Default"]
                }]
            for r in recs:
                dt = datetime.strptime(r["time"], "%Y-%m-%d %I:%M %p")
                candidates.append({
                    "place": r["place"],
                    "dt": dt,
                    "score": int(r["score"]),
                    "crowd": int(r["crowd_level"]),
                    "label": r.get("label", ""),
                    "reasons": r.get("reasons", []),
                })

        candidates.sort(key=lambda x: (x["dt"], -x["score"]))
        chosen: List[Dict[str, Any]] = []

        for c in sorted(candidates, key=lambda x: x["score"], reverse=True):
            if len(chosen) >= max_stops: break
            if not chosen:
                chosen.append(c); continue
            prev = chosen[-1]
            tm = self._travel_minutes(prev["place"], c["place"]) or 0
            gap = (c["dt"] - prev["dt"]).total_seconds() / 60.0
            if gap >= (self.dwell_minutes + tm):
                chosen.append(c)

        if hasattr(self.p, "order_stops_by_proximity"):
            ordered = self.p.order_stops_by_proximity([x["place"] for x in chosen])
            order_map = {o["title"]: i for i, o in enumerate(ordered, 1)}
            chosen.sort(key=lambda x: (order_map.get(x["place"], 999), x["dt"]))

        schedule: List[Dict[str, Any]] = []
        for i, c in enumerate(chosen, 1):
            item = {
                "order": i,
                "time": c["dt"].strftime("%I:%M %p"),
                "place": c["place"],
                "score": c["score"],
                "crowd": c["crowd"],
                "note": c["label"] or ", ".join(c["reasons"]) or "Good trade-off"
            }
            if i > 1:
                tm = self._travel_minutes(chosen[i-2]["place"], c["place"])
                if tm is not None: item["travel_min_from_prev"] = tm
            schedule.append(item)

        result: Dict[str, Any] = {
            "date": date.strftime("%Y-%m-%d"),
            "center": {"lat": lat, "lng": lng},
            "weather_summary": weather_summary,
            "schedule": schedule
        }
        if include_nearby:
            result["nearby_places"] = nearby
        return result
    

if __name__ == "__main__":
    from rag import RourkelalTourismSchedulePlanner  # or your module path

    planner = RourkelalTourismSchedulePlanner(
        api_key=os.getenv("GEMINI_API_KEY"),
        weather_api_key=os.getenv("WEATHER_KEY"),
        attractions_file="rag.json",
        restaurants_file="restaurants_rourkela.json",
        model_file="rkl_places_xgb.pkl"
    )

    geo = LatLngSchedulePlanner(planner, default_radius_km=6.0, dwell_minutes=60, travel_speed_kmh=20.0)

    lat, lng = 22.230, 84.826
    day_plan = geo.plan_day(lat=lat, lng=lng, date=datetime.now(), radius_km=6.0, max_stops=4)

    from pprint import pprint
    pprint(day_plan)
