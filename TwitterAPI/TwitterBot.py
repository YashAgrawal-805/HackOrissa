from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

app = Flask(__name__)

# Path to geckodriver
gecko_path = "geckodriver"

# Setup Selenium driver globally (persistent session)
service = Service(executable_path=gecko_path)
options = webdriver.FirefoxOptions()
# options.add_argument('--headless')  # Optional: run headless
driver = webdriver.Firefox(service=service, options=options)

# To store last seen tweet per hashtag
last_seen_map = {}

@app.route("/get-tweets", methods=["GET"])
def get_tweets():
    hashtag = request.args.get("hashtag", "").strip()
    if not hashtag:
        return jsonify({"error": "Missing 'hashtag' parameter"}), 400

    driver.get(f"https://twitter.com/search?q=%23{hashtag}&f=live")

    try:
        articles = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, '//article[@role="article"]'))
        )

        last_seen_text = last_seen_map.get(hashtag)
        new_last_seen = None
        new_tweets = []

        for article in articles:
            try:
                tweet_text_elem = article.find_element(By.XPATH, './/div[@data-testid="tweetText"]')
                timestamp_elem = article.find_element(By.XPATH, './/time')

                text = tweet_text_elem.text.strip()
                tweet_time = timestamp_elem.get_attribute("datetime")

                if new_last_seen is None:
                    new_last_seen = text

                if text == last_seen_text:
                    break  # already seen

                new_tweets.append({
                    "text": text,
                    "time": tweet_time
                })

            except Exception:
                continue

        if new_last_seen:
            last_seen_map[hashtag] = new_last_seen

        return jsonify({"hashtag": hashtag, "new_tweets": new_tweets})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def hello():
    return "Twitter Hashtag Scraper API is running."

if __name__ == "__main__":
    app.run(debug=True)
