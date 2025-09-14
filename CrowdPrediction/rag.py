import json
import os
import numpy as np
from typing import List, Dict, Any, Optional
from data_converter import CrowdPredictionInputProcessor
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI  
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.chains import RetrievalQA
import google.generativeai as genai
from langchain.prompts import PromptTemplate
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from datetime import datetime, timedelta
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS  

import math
import requests
import pickle
import calendar

from dotenv import load_dotenv
from pathlib import Path
import math

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dlmb/2)**2
    return 2 * R * math.asin(math.sqrt(a))


class RourkelalTourismSchedulePlanner:
    def __init__(self, api_key: str, weather_api_key: str = None, 
                 attractions_file: str = "rag.json", 
                 restaurants_file: str = "restaurants_rourkela.json",
                 model_file: str = "rkl_places_xgb.pkl"):

        load_dotenv()
        env_api = os.getenv("GEMINI_API_KEY")
        env_weather = os.getenv("WHEATHER_KEY")

        # explicit args win; fall back to env
        self.api_key = api_key or env_api
        self.weather_api_key = weather_api_key or env_weather
        if not self.api_key:
            raise ValueError("Missing Gemini API key (api_key or GEMINI_API_KEY)")
        # WEATHER KEY optional; we’ll fallback to sample weather if absent

        # normalize paths relative to this file
        base = Path(__file__).resolve().parent
        self.attractions_file = str((base / attractions_file).resolve())
        self.restaurants_file = str((base / restaurants_file).resolve())
        self.model_file = str((base / model_file).resolve())

        self.city_lat = 22.2396
        self.city_lng = 84.8633
        self.processor = CrowdPredictionInputProcessor()

        self.attractions_data = []
        self.restaurants_data = []
        self.crowd_predictions = {}
        self.places_data = {}

        self._load_data()
        self._load_crowd_model()
        self._build_place_id_map()  # single, consolidated (see below)

        # embeddings + LLM
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.7,
            google_api_key=self.api_key  # ✅ use resolved key
        )

        self._setup_vectorstore()
        self._setup_qa_chain()



    def _build_place_id_map(self):
        """Allow lookup by either id or title."""
        self.place_id_map = {}
        for item in self.attractions_data:
            pid = item.get("id")
            title = item.get("title")
            if pid and title:
                self.place_id_map[pid] = title
                self.place_id_map[title] = title  # title→title for normalization


    def _load_data(self):
        self.attractions_data, self.restaurants_data = [], []
        # --- attractions ---
        try:
            with open(self.attractions_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, list):
                self.attractions_data = data
            elif isinstance(data, dict) and "attractions" in data:
                self.attractions_data = data["attractions"]
        except FileNotFoundError:
            print(f"⚠️ Attractions file not found: {self.attractions_file}")
        except Exception as e:
            print(f"⚠️ Attractions load error: {e}")

        # --- restaurants ---
        try:
            with open(self.restaurants_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.restaurants_data = data if isinstance(data, list) else []
        except FileNotFoundError:
            print(f"⚠️ Restaurants file not found: {self.restaurants_file}")
        except Exception as e:
            print(f"⚠️ Restaurants load error: {e}")

        self._build_places_data()
        print(f"✅ Loaded {len(self.attractions_data)} attractions, {len(self.restaurants_data)} restaurants")


    def _build_places_data(self):
        """Build dictionary of places keyed by both ID and Title."""
        self.places_data = {}

        if not hasattr(self, "attractions_data"):
            print("⚠️ No attractions data found before building places_data")
            return

        for item in self.attractions_data:
            place_id = item.get("id")
            title = item.get("title")

            if place_id:
                self.places_data[place_id] = item
            if title:
                self.places_data[title] = item

        print(f"✅ Built places_data with {len(self.places_data)} entries. "
            f"Examples: {list(self.places_data.keys())[:5]}")



    def _load_crowd_model(self):
        try:
            with open(self.model_file, "rb") as f:
                self.crowd_model = pickle.load(f)
            # light sanity: ensure predict exists
            if not hasattr(self.crowd_model, "predict"):
                raise TypeError("Loaded model has no .predict(...) method")
            print("✅ Crowd prediction model loaded")
        except FileNotFoundError:
            raise FileNotFoundError(f"Crowd model file not found: {self.model_file}")
        except Exception as e:
            raise RuntimeError(f"Failed to load model {self.model_file}: {e}")

    def get_weather_forecast(self, days: int = 3) -> Dict[str, Any]:
        return self.get_current_weather(api_key=self.weather_api_key, days=days)

    def get_current_weather(self, api_key=None, days: int = 3) -> Dict[str, Any]:
        """Get current weather + forecast. Falls back to synthetic sample if API fails/missing."""
        if api_key:
            try:
                # current
                url_current = "https://api.weatherapi.com/v1/current.json"
                params_current = {"key": api_key, "q": f"{self.city_lat},{self.city_lng}", "aqi": "no"}
                resp_current = requests.get(url_current, params=params_current, timeout=10)
                resp_current.raise_for_status()
                data_current = resp_current.json()
                cur = data_current.get("current", {})
                condition_text = (cur.get("condition") or {}).get("text", "") or ""
                condition = condition_text.lower()

                rain_terms = {"rain","drizzle","shower","thunderstorm","storm","precipitation","wet","pour"}
                rain_flag = 1 if (cur.get("precip_mm", 0) or 0) > 0 or any(t in condition for t in rain_terms) else 0

                current = {
                    "temperature": cur.get("temp_c", 28.0),
                    "feels_like": cur.get("feelslike_c", cur.get("temp_c", 28.0)),
                    "humidity": cur.get("humidity", 60),
                    "condition": condition,
                    "rain_flag": rain_flag,
                    "wind_speed": cur.get("wind_kph", 0.0)
                }

                # forecast
                forecast = []
                try:
                    url_forecast = "https://api.weatherapi.com/v1/forecast.json"
                    params_forecast = {"key": api_key, "q": f"{self.city_lat},{self.city_lng}", "days": days, "aqi": "no", "alerts": "no"}
                    resp_forecast = requests.get(url_forecast, params=params_forecast, timeout=10)
                    resp_forecast.raise_for_status()
                    data_forecast = resp_forecast.json()
                    for day in data_forecast.get("forecast", {}).get("forecastday", []):
                        for hour in day.get("hour", []):
                            ts = hour.get("time_epoch")
                            dt = datetime.fromtimestamp(ts) if ts else None
                            forecast.append({
                                "datetime": dt or datetime.now(),
                                "temperature": hour.get("temp_c", current["temperature"]),
                                "feels_like": hour.get("feelslike_c", current["feels_like"]),
                                "humidity": hour.get("humidity", current["humidity"]),
                                "description": (hour.get("condition") or {}).get("text", "").lower(),
                                "rain": hour.get("precip_mm", 0.0),
                                "wind_speed": hour.get("wind_kph", 0.0),
                            })
                except Exception as fe:
                    print(f"⚠️ Forecast error: {fe}")
                    forecast = self._generate_sample_weather(days)["forecast"]

                return {"current": current, "forecast": forecast, "source": "weatherapi",
                        "location": f"Rourkela ({self.city_lat}, {self.city_lng})"}

            except Exception as e:
                print(f"⚠️ Weather API error: {e}. Using sample weather.")
                return self._generate_sample_weather(days)
        else:
            print("⚠️ No WEATHER_KEY. Using sample weather.")
            return self._generate_sample_weather(days)

        
    def _generate_sample_weather(self, days: int) -> Dict[str, Any]:
        current_date = datetime.now()
        forecast = []

        for day in range(days):
            date = current_date + timedelta(days=day)
            # Seasonal ranges
            month = date.month
            if month in [12, 1, 2]:  # Winter
                temp_range = (15, 25)
                rain_chance = 0.1
            elif month in [3, 4, 5]:  # Summer
                temp_range = (25, 40)
                rain_chance = 0.2
            elif month in [6, 7, 8, 9]:  # Monsoon
                temp_range = (20, 32)
                rain_chance = 0.7
            else:  # Post-monsoon
                temp_range = (18, 30)
                rain_chance = 0.3

            # Generate 3-hourly forecast
            for hour in range(0, 24, 3):
                forecast_time = date.replace(hour=hour, minute=0, second=0)
                temp = temp_range[0] + (temp_range[1] - temp_range[0]) * (0.5 + 0.5 * math.sin(math.pi * hour / 12))

                forecast.append({
                    'datetime': forecast_time,
                    'temperature': round(temp, 1),
                    'feels_like': round(temp + 2, 1),
                    'humidity': 60 + (rain_chance * 30),
                    'description': 'rainy' if rain_chance > 0.5 else 'clear' if rain_chance < 0.2 else 'cloudy',
                    'rain': 5.0 if rain_chance > 0.6 else 0.0,
                    'wind_speed': 5.0
                })

        return {
            'forecast': forecast,
            'source': 'sample_data',
            'location': f"Rourkela (Sample Data)"
        }

    def predict_crowd_level(self, place_name: str, visit_datetime: datetime, weather_data: Dict = None) -> Dict[str, Any]:
        # Normalize place (allow id or title)
        if place_name in self.places_data:
            place = self.places_data[place_name]
            place_name = place.get("title", place_name)
        else:
            raise ValueError(f"Place '{place_name}' not found.")

        model = self.crowd_model

        # Build features (hour must match the datetime)
        feature_vector = self.processor.prepare_model_input(
            place_name=place_name,
            target_datetime=visit_datetime,
            target_hour=visit_datetime.hour,
            weather_api_key=self.weather_api_key
        )
        X = np.array(feature_vector, dtype=float).reshape(1, -1)

        # ---- Predict with robust handling of classifier OR regressor ----
        y = float(model.predict(X)[0])

        proba: Optional[float] = None
        crowd_level: Optional[int] = None

        if hasattr(model, "predict_proba"):
            p = float(model.predict_proba(X)[0][1])
            proba = max(0.0, min(1.0, p))
            crowd_level = int(round(proba * 100))
        elif hasattr(model, "decision_function"):
            margin = float(model.decision_function(X)[0])
            p = 1.0 / (1.0 + np.exp(-margin))
            proba = max(0.0, min(1.0, p))
            crowd_level = int(round(proba * 100))
        else:
            # Regressor / direct score
            if 0.0 <= y <= 1.0:
                proba = y
                crowd_level = int(round(y * 100))
            elif 1.0 < y <= 100.0:
                crowd_level = int(round(y))
                proba = crowd_level / 100.0
            elif y in (0.0, 1.0):
                proba = y
                crowd_level = int(round(y * 100))
            else:
                crowd_level = int(max(0, min(100, round(y))))
                proba = crowd_level / 100.0

        desc = f"Estimated crowd level around {crowd_level}%"

        # Suggest better nearby times (±2h) with same robust handling
        best_alternatives: List[str] = []
        for hour_shift in (-2, -1, 1, 2):
            alt_time = visit_datetime + timedelta(hours=hour_shift)
            try:
                alt_features = self.processor.prepare_model_input(
                    place_name=place_name,
                    target_datetime=alt_time,
                    target_hour=alt_time.hour,
                    weather_api_key=self.weather_api_key
                )
                X_alt = np.array(alt_features, dtype=float).reshape(1, -1)

                y_alt = float(model.predict(X_alt)[0])
                if hasattr(model, "predict_proba"):
                    p_alt = float(model.predict_proba(X_alt)[0][1])
                    alt_level = int(round(max(0.0, min(1.0, p_alt)) * 100))
                elif hasattr(model, "decision_function"):
                    margin_alt = float(model.decision_function(X_alt)[0])
                    p_alt = 1.0 / (1.0 + np.exp(-margin_alt))
                    alt_level = int(round(max(0.0, min(1.0, p_alt)) * 100))
                else:
                    if 0.0 <= y_alt <= 1.0:
                        alt_level = int(round(y_alt * 100))
                    elif 1.0 < y_alt <= 100.0:
                        alt_level = int(round(y_alt))
                    elif y_alt in (0.0, 1.0):
                        alt_level = int(round(y_alt * 100))
                    else:
                        alt_level = int(max(0, min(100, round(y_alt))))

                if alt_level < crowd_level:
                    best_alternatives.append(f"{alt_time.strftime('%I:%M %p')} (~{alt_level}% crowd)")
            except Exception:
                continue

        if not best_alternatives:
            best_alternatives = (
                ["Visit earlier in the morning or later in the evening"]
                if crowd_level > 40 else ["No better times found"]
            )

        # Confidence from probability
        prob_val = proba if proba is not None else (crowd_level / 100.0)
        confidence = "high" if prob_val >= 0.75 else "medium" if prob_val >= 0.5 else "low"

        return {
            "place": place_name,
            "datetime": visit_datetime.isoformat(),
            "crowd_level": crowd_level,
            "description": desc,
            "probability": prob_val,
            "context": self.processor.get_prediction_context(
                place_name=place_name,
                target_datetime=visit_datetime,
                target_hour=visit_datetime.hour,
                weather_api_key=self.weather_api_key
            ),
            "confidence": confidence,
            "best_alternative_times": best_alternatives
        }
    def find_nearby_places(self, center_lat: float, center_lng: float,
                       radius_km: float = 6.0, kind: str | None = None, limit: int = 10):
        """
        Return a list of nearby attractions within radius_km, sorted by distance.
        kind: "attraction" or "restaurant" to filter via metadata['type'] (optional).
        """
        results = []
        # Walk the attractions you indexed
        for item in self.attractions_data:
            lat, lng = item.get("lat"), item.get("lng")
            if lat is None or lng is None: 
                continue
            try:
                dist = haversine_km(float(lat), float(lng), center_lat, center_lng)
            except Exception:
                continue
            if dist <= radius_km:
                if kind and kind != "attraction":
                    continue
                results.append({
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "lat": float(lat),
                    "lng": float(lng),
                    "distance_km": round(dist, 2),
                })
        results.sort(key=lambda r: r["distance_km"])
        return results[:limit]
    
    def order_stops_by_proximity(self, place_keys: list[str],
                                start_lat: float | None = None, start_lng: float | None = None):
        """Greedy nearest-neighbor ordering of a small list of places."""
        pts = []
        for k in place_keys:
            coords = self._get_place_coords(k)
            if coords:
                lat, lng = coords
                title = self.place_id_map.get(k, k)
                pts.append({"key": k, "title": title, "lat": lat, "lng": lng})
        if not pts:
            return []

        cur_lat = start_lat if start_lat is not None else self.city_lat
        cur_lng = start_lng if start_lng is not None else self.city_lng
        remaining = pts[:]
        route = []
        while remaining:
            nxt = min(remaining, key=lambda p: haversine_km(cur_lat, cur_lng, p["lat"], p["lng"]))
            route.append(nxt)
            cur_lat, cur_lng = nxt["lat"], nxt["lng"]
            remaining.remove(nxt)
        return route


    def _get_place_coords(self, key: str):
        """key can be id ('religious_1') or title ('Hanuman Vatika')."""
        place = self.places_data.get(key)
        if not place:
            return None
        lat, lng = place.get("lat"), place.get("lng")
        try:
            return float(lat), float(lng)
        except (TypeError, ValueError):
            return None

    def _suggest_better_times(self, place_id: str, current_time: datetime) -> List[str]:
        """Suggest better times to visit if current time has high crowds"""
        suggestions = []
        crowd_data = self.crowd_predictions.get(place_id, {})
        
        # Check different times on the same day
        for hour in [7, 9, 11, 15, 17, 19]:
            test_time = current_time.replace(hour=hour)
            test_crowd = self.predict_crowd_level(place_id, test_time)
            if test_crowd['crowd_level'] < 50:
                time_str = test_time.strftime('%I:%M %p')
                suggestions.append(f"{time_str} (Crowd: {test_crowd['crowd_level']}%)")
        
        return suggestions[:3]  # Return top 3 suggestions
        

    def _setup_vectorstore(self):
        import os, shutil
        documents: List[Document] = []

        for item in self.attractions_data:
            pid, title = item.get("id"), item.get("title")
            if not pid or not title:
                continue
            crowd_info = self.crowd_predictions.get(pid, {})
            content = f"""
    Type: Tourist Attraction - {self._categorize_place(pid)}
    Name: {title}
    Description: {item.get('content','')}
    Location: Latitude {item.get('lat','N/A')}, Longitude {item.get('lng','N/A')}
    Category: {self._categorize_place(pid)}
    Best for: {self._get_best_for_category(pid)}

    Crowd Information:
    - Busiest days: {self._get_busiest_days(crowd_info)}
    - Best times to visit: Early morning (6-8 AM) or late evening (after 7 PM)
    - Weather sensitivity: {'High' if crowd_info.get('weather_sensitivity', {}).get('rain', 0) >= 0.5 else 'Low'}
    - Capacity level: {crowd_info.get('capacity_level', 'medium')}
    """.strip()
            documents.append(Document(
                page_content=content,
                metadata={
                    "id": pid,
                    "name": title,
                    "type": "attraction",
                    "category": self._categorize_place(pid),
                    "lat": item.get("lat"),
                    "lng": item.get("lng"),
                    "has_crowd_data": pid in self.crowd_predictions,
                    "weather_sensitive": crowd_info.get('weather_sensitivity', {}).get('rain', 0) >= 0.5
                }
            ))

        for item in self.restaurants_data:
            name = item.get("name")
            if not name:
                continue
            rating = item.get("rating") or 0
            rating_count = item.get("user_ratings_total") or 0
            content = f"""
    Type: Restaurant
    Name: {name}
    Address: {item.get('address','')}
    Rating: {rating}/5 ({rating_count} reviews)
    Location: Latitude {item.get('lat','')}, Longitude {item.get('lng','')}
    Cuisine: {self._guess_cuisine_type(name)}
    Price Range: {self._estimate_price_range(name, rating)}
    Good for: {self._get_restaurant_suitable_for(name, rating)}

    Crowd & Timing:
    - Peak hours: 12-2 PM (lunch), 7-9 PM (dinner)
    - Less crowded: 3-6 PM, after 9 PM
    - Weather impact: Indoor dining largely unaffected
    - Reservation recommended: {'Yes' if rating > 4.0 else 'Not required'}
    """.strip()
            documents.append(Document(
                page_content=content,
                metadata={
                    "id": item.get("place_id", name),
                    "name": name,
                    "type": "restaurant",
                    "category": "dining",
                    "lat": item.get("lat"),
                    "lng": item.get("lng"),
                    "rating": rating,
                    "rating_count": rating_count,
                    "price_level": self._estimate_price_range(name, rating)
                }
            ))

        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
        chunks = splitter.split_documents(documents)

        idx_dir = "faiss_index"
        try:
            self.vectorstore = FAISS.load_local(
                idx_dir,
                self.embeddings,
                allow_dangerous_deserialization=True
            )
            print(f"✅ Loaded FAISS index from '{idx_dir}'")
        except Exception as e:
            print(f"♻️ Rebuilding FAISS index (load failed: {e})")
            if os.path.exists(idx_dir):
                shutil.rmtree(idx_dir, ignore_errors=True)
            self.vectorstore = FAISS.from_documents(chunks, self.embeddings)
            self.vectorstore.save_local(idx_dir)
            print(f"✅ Created FAISS index with {len(chunks)} chunks → '{idx_dir}'")

    def _get_busiest_days(self, crowd_info: Dict) -> str:
        """Get the busiest days for a place"""
        if not crowd_info or 'daily_base_crowds' not in crowd_info:
            return "Weekends"
        
        daily_crowds = crowd_info['daily_base_crowds']
        sorted_days = sorted(daily_crowds.items(), key=lambda x: x[1], reverse=True)
        return ", ".join([day.capitalize() for day, _ in sorted_days[:3]])
    
    def _setup_qa_chain(self):


        allowed_titles = sorted({a["title"] for a in self.attractions_data if a.get("title")})
        allowed_block = "\n".join(f"- {t}" for t in allowed_titles)

        prompt_template = """
You are an expert Rourkela trip planner. Use ONLY the provided context and the allowlist of places.

ALLOWLIST (you MUST ONLY reference places from this list; do not invent new names):
{allowed_places}
Context: {context}

Question: {question}

IMPORTANT PLANNING CONSIDERATIONS:
Weather & Timing:
- Check weather conditions before recommending outdoor activities
- Suggest indoor alternatives for rainy days
- Consider temperature comfort (ideal: 15-30°C)
- Avoid midday visits (12-3 PM) during hot weather (>35°C)

Crowd Management:
- Suggest weekdays over weekends for better experience
- Provide alternative timings when places are less crowded
- Factor in festival seasons and special events

Practical Schedule Planning:
- Group nearby locations to minimize travel time
- Include buffer time for unexpected delays
- Suggest meal times aligned with restaurant peak hours
- Consider opening/closing times of attractions
- Include rest breaks, especially for families

Weather-Specific Recommendations:
- Rainy Day: Indoor attractions (temples, museums, covered markets), shopping
- Hot Weather: Early morning visits, air-conditioned restaurants, parks with shade
- Pleasant Weather: Outdoor activities, dam visits, longer walks

Provide detailed schedules with:
1. Specific timings with weather considerations
2. Crowd level expectations and alternatives
4. Backup plans for weather changes
5. Restaurant timing to avoid peak crowds
6. Transportation tips considering weather

Answer:"""

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"],
            partial_variables={"allowed_places": allowed_block}
        )

        retriever = self.vectorstore.as_retriever(
            search_kwargs={"k": 12, "fetch_k": 40, "filter": {"type": "attraction"}}
        )

        from langchain.chains import RetrievalQA
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=True
        )
    
    def create_smart_schedule(self, duration_days: int, interests: List[str] = None, 
                            budget: str = "moderate", group_type: str = "family",
                            start_date: datetime = None) -> Dict[str, Any]:
        duration_days = int(duration_days or 1)
        if duration_days < 1: duration_days = 1
        if duration_days > 7: duration_days = 7  # cap to keep LLM prompt reasonable
        interests = interests or ['religious', 'nature', 'food']
        start_date = start_date or datetime.now()

        weather_forecast = self.get_weather_forecast(duration_days)
        daily_weather = {}
        if weather_forecast.get("forecast"):
            for day in range(duration_days):
                day_date = start_date + timedelta(days=day)
                day_forecasts = [f for f in weather_forecast['forecast'] if f['datetime'].date() == day_date.date()]
                if day_forecasts:
                    avg_temp = sum(f['temperature'] for f in day_forecasts) / len(day_forecasts)
                    total_rain = sum(f.get('rain', 0.0) for f in day_forecasts)
                    daily_weather[day] = {
                        'date': day_date,
                        'avg_temperature': avg_temp,
                        'rain': total_rain,
                        'description': day_forecasts[0].get('description', 'clear') or 'clear'
                    }

        weather_context = self._create_weather_context(daily_weather)

        query = f"""
    Create a detailed {duration_days}-day tourist schedule for Rourkela starting from {start_date.strftime('%Y-%m-%d')} with the following preferences:

    PREFERENCES:
    - Interests: {', '.join(interests)}
    - Budget: {budget}
    - Group type: {group_type}

    WEATHER FORECAST:
    {weather_context}

    REQUIREMENTS:
    - Include specific timings optimized for weather and crowds
    - Suggest indoor alternatives for rainy days
    - Provide crowd level expectations for each attraction
    - Include restaurant recommendations with timing
    - Consider travel time between locations
    - Add weather-appropriate tips and alternatives
    - Optimize for minimal travel time and maximum experience
    """
        try:
            result = self.qa_chain({"query": query})
            answer = result.get("result", "")
            sources = result.get("source_documents", [])
        except Exception as e:
            answer, sources = f"(Planner fallback) {e}", []

        schedule_with_predictions = self._enhance_schedule_with_predictions(answer, daily_weather)

        return {
            'schedule': schedule_with_predictions,
            'weather_forecast': daily_weather,
            'duration_days': duration_days,
            'interests': interests,
            'budget': budget,
            'group_type': group_type,
            'sources_used': len(sources)
        }

    
    def _create_weather_context(self, daily_weather: Dict) -> str:
        if not daily_weather:
            return "No reliable forecast; plan for flexible indoor/outdoor options."
        lines = []
        for day, weather in daily_weather.items():
            date_str = weather['date'].strftime('%A, %B %d')
            wet = "Rainy" if weather['rain'] > 2 else "Dry"
            lines.append(f"Day {day + 1} ({date_str}): {weather['avg_temperature']:.1f}°C, {wet}, {weather['description']}")
        return "\n".join(lines)

    
    def _enhance_schedule_with_predictions(self, schedule_text: str, 
                                         daily_weather: Dict) -> str:
        """Enhance schedule with specific crowd predictions"""
        enhanced_schedule = schedule_text
        
        # Add weather and crowd summary at the beginning
        weather_summary = "\n=== WEATHER & CROWD INTELLIGENCE ===\n"
        for day, weather in daily_weather.items():
            date_str = weather['date'].strftime('%A, %B %d')
            weather_summary += f"Day {day + 1} ({date_str}): "
            weather_summary += f"{weather['avg_temperature']:.1f}°C, "
            
            if weather['rain'] > 5:
                weather_summary += "Heavy rain expected - Focus on indoor activities\n"
            elif weather['rain'] > 2:
                weather_summary += "Light rain possible - Carry umbrella, indoor backup plans ready\n"
            elif weather['avg_temperature'] > 35:
                weather_summary += "Hot weather - Early morning and evening visits recommended\n"
            else:
                weather_summary += "Pleasant weather - Great for all outdoor activities\n"
        
        weather_summary += "\n=== ORIGINAL SCHEDULE ===\n"
        enhanced_schedule = weather_summary + enhanced_schedule
        
        return enhanced_schedule
    
    # Keep all the other methods from the previous version
    def _categorize_place(self, place_id: str) -> str:
        if place_id.startswith('religious'):
            return 'Religious Site'
        elif place_id.startswith('nature'):
            return 'Nature/Recreation'
        elif place_id.startswith('general'):
            return 'General Information'
        else:
            return 'Tourist Attraction'
    
    def _get_best_for_category(self, place_id: str) -> str:
        if place_id.startswith('religious'):
            return 'Spiritual experience, photography, cultural immersion'
        elif place_id.startswith('nature'):
            return 'Family outings, photography, relaxation, adventure'
        else:
            return 'Sightseeing, cultural experience'
    
    def _guess_cuisine_type(self, name: str) -> str:
        name_lower = name.lower()
        if any(word in name_lower for word in ['pizza', 'domino']):
            return 'Italian/Fast Food'
        elif any(word in name_lower for word in ['dosa', 'idli', 'south']):
            return 'South Indian'
        elif any(word in name_lower for word in ['sweet', 'mithai']):
            return 'Sweets/Desserts'
        elif any(word in name_lower for word in ['fast food', 'momos', 'chaat']):
            return 'Fast Food/Street Food'
        elif 'hotel' in name_lower:
            return 'Multi-cuisine'
        else:
            return 'Indian/Multi-cuisine'
    def get_recommendations(self, query: str, days: int = 1) -> Dict[str, Any]:
        """
        Provide recommendations by combining weather forecast,
        WeatherAwareRecommendationEngine, and QA chain.
        """
        # 1. Get current weather
        weather = self.get_current_weather(api_key=self.weather_api_key, days=days)
        current = weather["forecast"][0] if "forecast" in weather and weather["forecast"] else {}

        condition = current.get("description", "clear")
        temp = current.get("temperature", 28)
        rain = current.get("rain", 0.0)

        # 2. Weather-based rec engine
        rec_engine = WeatherAwareRecommendationEngine(self)
        weather_recs = rec_engine.get_weather_appropriate_activities(
            weather_condition=condition,
            temperature=temp,
            rain_mm=rain
        )

        # 3. Smart keyword detection
        query_lower = query.lower()
        filtered_recs = []
        if "indoor" in query_lower:
            filtered_recs = [r for r in weather_recs if "Indoor" in r["activity"] or "Temple" in r["activity"]]
        elif "outdoor" in query_lower:
            filtered_recs = [r for r in weather_recs if "Outdoor" in r["activity"] or "Park" in r["activity"]]

        if filtered_recs:
            return {
                "answer": f"Here are indoor/outdoor activities in Rourkela based on your query and weather ({condition}, {temp}°C):",
                "weather_recommendations": filtered_recs,
                "sources": ["WeatherAwareRecommendationEngine"]
            }

        if weather_recs:
            qa_result = self.qa_chain({"query": query})
            return {
                "answer": f"Based on the weather ({condition}, {temp}°C, rain={rain}mm), here are suggestions:",
                "weather_recommendations": weather_recs,
                "qa_answer": qa_result["result"],
                "sources": ["WeatherAwareRecommendationEngine"] + [doc.metadata for doc in qa_result.get("source_documents", [])]
            }


        # 4. Fallback to QA chain
        result = self.qa_chain({"query": query})
        return {
            "answer": result["result"],
            "sources": [doc.metadata for doc in result.get("source_documents", [])]
        }

    def _estimate_price_range(self, name: str, rating: float) -> str:
        name_lower = name.lower()
        if any(word in name_lower for word in ['hotel', 'palace', 'regency', 'international']):
            return 'expensive' if rating > 4.0 else 'moderate'
        elif any(word in name_lower for word in ['fast food', 'stall', 'chaat', 'street']):
            return 'budget'
        elif rating and rating > 4.2:
            return 'moderate'
        else:
            return 'budget'
    
    def _get_restaurant_suitable_for(self, name: str, rating: float) -> str:
        name_lower = name.lower()
        if 'hotel' in name_lower and rating > 4.0:
            return 'Family dining, business meals, special occasions'
        elif any(word in name_lower for word in ['fast food', 'pizza']):
            return 'Quick meals, casual dining, groups'
        elif any(word in name_lower for word in ['sweet', 'snacks']):
            return 'Desserts, tea time, gifts'
        else:
            return 'Casual dining, local experience'


# Usage Example
def main():
    
    # Initialize the planner
    API_KEY = "AIzaSyAOrngB0HJfV3XUJTQT3Lmmc6iigVHFE9I"
    WEATHER_API_KEY = "0203b89a4bf94e8ab5f220531252308"  
    
    planner = RourkelalTourismSchedulePlanner(
            api_key=API_KEY,
            weather_api_key=WEATHER_API_KEY,
            attractions_file="rag.json",      
            restaurants_file="restaurants_rourkela.json",
            model_file="rkl_places_xgb.pkl")

    # Get today's date & current time
    now = datetime.now()
    
    # Example 1: Create a smart schedule starting from today
    print("=== Smart 3-Day Schedule with Weather & Crowd Intelligence ===")
    smart_schedule = planner.create_smart_schedule(
        duration_days=3,
        interests=['religious', 'nature', 'food'],
        budget='moderate',
        group_type='family',
        start_date=now  # ✅ use current date
    )
    
    print(smart_schedule['schedule'])
    print(f"\nWeather Summary:")
    for day, weather in smart_schedule['weather_forecast'].items():
        print(f"Day {day+1}: {weather['avg_temperature']:.1f}°C, Rain: {weather['rain']:.1f}mm")
    
    # Example 2: Get crowd prediction for current time
    print("\n=== Crowd Prediction Example ===")
    visit_time = now  # ✅ use current datetime
    crowd_info = planner.predict_crowd_level("Hanuman Vatika", visit_time)
    print(f"Hanuman Vatika at {visit_time.strftime('%A %I:%M %p')}:")
    print(f"Crowd Level: {crowd_info['crowd_level']}% - {crowd_info['description']}")
    print(f"Better times: {crowd_info['best_alternative_times']}")
    
    # Example 3: Weather-specific recommendations
    print("\n=== Weather-Based Recommendations ===")
    weather_query = planner.get_recommendations(
        "What are the best indoor activities in Rourkela for a rainy day with family?"
    )
    print(weather_query["answer"])

    if "weather_recommendations" in weather_query:
        for rec in weather_query["weather_recommendations"]:
            print(f"- {rec['activity']}: {', '.join(rec['places'])} ({rec['reason']})")
    
    # Example 4: Get weather forecast from now
    print("\n=== 5-Day Weather Forecast ===")
    weather = planner.get_weather_forecast(5)
    print(f"Weather source: {weather['source']}")
    for i, forecast in enumerate(weather['forecast'][:8]):  # Show first day's forecast
        print(f"{forecast['datetime'].strftime('%Y-%m-%d %H:%M')}: "
              f"{forecast['temperature']:.1f}°C, {forecast['description']}, "
              f"Rain: {forecast['rain']:.1f}mm")

def create_crowd_data_file():
    """Helper function to create a sample crowd prediction file"""
    sample_crowd_data = {
        "religious_1": {
            "place_name": "Hanuman Vatika",
            "daily_base_crowds": {
                "monday": 40, "tuesday": 65, "wednesday": 35, "thursday": 40,
                "friday": 55, "saturday": 85, "sunday": 90
            },
            "hourly_patterns": {
                "early_morning": {"multiplier": 0.4, "hours": [6, 7, 8]},
                "morning": {"multiplier": 0.7, "hours": [9, 10, 11]},
                "afternoon": {"multiplier": 0.6, "hours": [12, 13, 14, 15]},
                "evening": {"multiplier": 1.0, "hours": [16, 17, 18, 19]},
                "night": {"multiplier": 0.5, "hours": [20, 21, 22]}
            },
            "festival_multipliers": {
                "hanuman_jayanti": 3.5, "tuesday_special": 1.8, "diwali": 2.5
            },
            "weather_sensitivity": {"rain": 0.8, "hot_weather": 0.7, "cold_weather": 0.9},
            "capacity_level": "high"
        },
        "nature_1": {
            "place_name": "Indira Gandhi Park",
            "daily_base_crowds": {
                "monday": 25, "tuesday": 20, "wednesday": 25, "thursday": 30,
                "friday": 40, "saturday": 80, "sunday": 85
            },
            "hourly_patterns": {
                "early_morning": {"multiplier": 0.3, "hours": [6, 7, 8]},
                "morning": {"multiplier": 0.6, "hours": [9, 10, 11]},
                "afternoon": {"multiplier": 0.4, "hours": [12, 13, 14, 15]},
                "evening": {"multiplier": 1.0, "hours": [16, 17, 18, 19]},
                "night": {"multiplier": 0.2, "hours": [20, 21, 22]}
            },
            "festival_multipliers": {
                "children_day": 2.0, "republic_day": 1.5, "independence_day": 1.8
            },
            "weather_sensitivity": {"rain": 0.2, "hot_weather": 0.5, "cold_weather": 0.8},
            "capacity_level": "high"
        }
    }
    
    with open("crowd_predictions.json", "w", encoding="utf-8") as f:
        json.dump(sample_crowd_data, f, indent=2, ensure_ascii=False)
    
    print("Created sample crowd_predictions.json file")




class WeatherAwareRecommendationEngine:
    """Additional class for weather-specific recommendations"""
    
    def __init__(self, planner: RourkelalTourismSchedulePlanner):
        self.planner = planner
    
    def get_weather_appropriate_activities(self, weather_condition: str, 
                                         temperature: float, 
                                         rain_mm: float = 0) -> List[Dict]:
        """Get activities suitable for specific weather conditions"""
        recommendations = []
        
        # Rainy weather recommendations
        if rain_mm > 2 or any(word in weather_condition.lower() for word in ['rain', 'thunderstorm', 'drizzle']):
            # Rainy recommendations

            recommendations.extend([
                {
                    'activity': 'Temple visits',
                    'places': ['Hanuman Vatika', 'Vedvyas Temple', 'Jagannath Temple'],
                    'reason': 'Covered areas, spiritual experience unaffected by rain',
                    'timing': 'Any time, avoid travel during heavy downpours'
                },
                {
                    'activity': 'Indoor dining',
                    'places': ['Hotel Radhika Regency', 'Curry Pot', 'Pizza Den'],
                    'reason': 'Comfortable indoor seating, good ambiance',
                    'timing': 'Extended meal times, perfect for long conversations'
                },
                {
                    'activity': 'Shopping and local markets',
                    'places': ['Covered markets in sectors', 'Shopping complexes'],
                    'reason': 'Browse local handicrafts and souvenirs',
                    'timing': 'Afternoon hours when rain is typically lighter'
                }
            ])
        
        # Hot weather recommendations (>35°C)
        elif temperature > 35:
            recommendations.extend([
                {
                    'activity': 'Early morning temple visits',
                    'places': ['Hanuman Vatika', 'Vaishno Devi Temple'],
                    'reason': 'Peaceful atmosphere, cooler temperatures',
                    'timing': '6:00-9:00 AM'
                },
                {
                    'activity': 'Air-conditioned restaurants',
                    'places': ['Hotel Radhika Regency', 'The Sarovar Court'],
                    'reason': 'Comfortable dining environment',
                    'timing': '12:00-3:00 PM (lunch break from heat)'
                },
                {
                    'activity': 'Evening park visits',
                    'places': ['Indira Gandhi Park', 'Green Park'],
                    'reason': 'Cooler evening breeze, family activities',
                    'timing': '5:00-7:00 PM'
                }
            ])
        
        # Pleasant weather recommendations (15-30°C)
        else:
            recommendations.extend([
                {
                    'activity': 'Outdoor sightseeing',
                    'places': ['Mandira Dam', 'Pitamahal Dam', 'Darjeeng Picnic Spot'],
                    'reason': 'Perfect weather for photography and nature walks',
                    'timing': 'Any time, especially 9:00 AM - 5:00 PM'
                },
                {
                    'activity': 'Trekking and adventure',
                    'places': ['Kanha Kund', 'Ghagara Waterfall', 'Ghogar Natural Site'],
                    'reason': 'Ideal conditions for outdoor activities',
                    'timing': 'Early morning or late afternoon for best experience'
                },
                {
                    'activity': 'Riverside relaxation',
                    'places': ['Koel Riverbank', 'Vedvyas Temple confluence'],
                    'reason': 'Serene environment, perfect for meditation',
                    'timing': 'Sunset hours for beautiful views'
                }
            ])
        
        return recommendations


    def create_weather_adaptive_itinerary(self, base_itinerary: List[Dict], 
                                        weather_forecast: List[Dict]) -> List[Dict]:
        """Adapt an existing itinerary based on weather forecast"""
        adapted_itinerary = []
        
        for day_plan in base_itinerary:
            day_weather = weather_forecast[day_plan.get('day', 0)]
            
            # Create weather-aware adaptations
            adaptations = {
                'original_plan': day_plan,
                'weather_context': day_weather,
                'adaptations': [],
                'backup_plans': []
            }
            
            # Add weather-specific modifications
            if day_weather.get('rain', 0) > 5:  # Heavy rain
                adaptations['adaptations'].append(
                    "Heavy rain expected - Move outdoor activities to covered areas"
                )
                adaptations['backup_plans'].extend([
                    "Visit temples with covered walkways",
                    "Extended dining experiences at indoor restaurants",
                    "Local shopping in covered markets"
                ])
            
            elif day_weather.get('temperature', 25) > 35:  # Hot weather
                adaptations['adaptations'].append(
                    "Hot weather - Shift schedule to early morning and evening"
                )
                adaptations['backup_plans'].extend([
                    "6:00-9:00 AM: Temple visits and morning activities",
                    "12:00-4:00 PM: Indoor dining and rest",
                    "5:00-8:00 PM: Parks and outdoor sightseeing"
                ])
            
            adapted_itinerary.append(adaptations)
        
        return adapted_itinerary


# Additional utility functions
def analyze_crowd_patterns(crowd_data: Dict) -> Dict[str, Any]:
    """Analyze crowd patterns to provide insights"""
    analysis = {
        'peak_days': [],
        'best_days': [],
        'peak_hours': [],
        'best_hours': [],
        'seasonal_trends': {}
    }
    
    # Analyze daily patterns across all places
    all_daily_crowds = {}
    for place_data in crowd_data.values():
        daily_crowds = place_data.get('daily_base_crowds', {})
        for day, crowd in daily_crowds.items():
            if day not in all_daily_crowds:
                all_daily_crowds[day] = []
            all_daily_crowds[day].append(crowd)
    
    # Calculate average crowds per day
    avg_daily_crowds = {
        day: sum(crowds) / len(crowds) 
        for day, crowds in all_daily_crowds.items()
    }
    
    # Find peak and best days
    sorted_days = sorted(avg_daily_crowds.items(), key=lambda x: x[1])
    analysis['best_days'] = [day for day, _ in sorted_days[:2]]
    analysis['peak_days'] = [day for day, _ in sorted_days[-2:]]
    
    # Analyze hourly patterns
    peak_hours = set()
    best_hours = set()
    
    for place_data in crowd_data.values():
        hourly_patterns = place_data.get('hourly_patterns', {})
        for period, pattern in hourly_patterns.items():
            if pattern['multiplier'] > 0.8:
                peak_hours.update(pattern['hours'])
            elif pattern['multiplier'] < 0.5:
                best_hours.update(pattern['hours'])
    
    analysis['peak_hours'] = sorted(list(peak_hours))
    analysis['best_hours'] = sorted(list(best_hours))
    
    return analysis


if __name__ == "__main__":
    # Create sample crowd data file if it doesn't exist
    import os
    if not os.path.exists("crowd_predictions.json"):
        create_crowd_data_file()
    
    main()