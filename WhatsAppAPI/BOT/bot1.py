from selenium import webdriver
from selenium.webdriver.firefox.service import Service
import time

# Provide the correct path to geckodriver
gecko_path = "geckodriver"

# Create a Service object and initialize WebDriver
service = Service(executable_path=gecko_path)
driver = webdriver.Firefox(service=service)

url = "http://localhost:3000/api/whatsapp"  # Replace with your desired URL

try:
    while True:
        driver.get(url)
        print("Opened:", url)
        time.sleep(600)  # Wait for 10 minutes (600 seconds)
except KeyboardInterrupt:
    print("Script stopped by user.")
finally:
    driver.quit()
