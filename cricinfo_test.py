import requests
from bs4 import BeautifulSoup
import json
import time

url = "https://www.espncricinfo.com/live-cricket-score"

# We can bypass basic bot detection sometimes by spoofing better headers or using a different scraping method.
# But realistically, if espncricinfo blocks us, we might need to use a public API or a different endpoint.
# Let's check if there's a JSON endpoint they use internally. 
