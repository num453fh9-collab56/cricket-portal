import requests
from bs4 import BeautifulSoup
import json
import time
import os
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

# ==========================================
# GEMINI API KEY LOADED FROM .ENV
# ==========================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_ai_commentary(match_data):
    """
    Calls the real Gemini API to generate a savage commentary or prediction.
    """
    try:
        # Configure the API key
        genai.configure(api_key=GEMINI_API_KEY)

        # Initialize the model (using a currently supported model)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = f"Write exactly 1 sentence of savage, humorous cricket commentary or prediction for this match situation: {match_data['match']}. Current score: {match_data['score']}. Situation: {match_data['status']}."

        # Call the API
        response = model.generate_content(prompt)

        # Return the generated text, stripped of any leading/trailing whitespace or newlines
        return response.text.strip()

    except Exception as e:
        print(f"Error generating AI commentary: {e}")
        return "AI is currently speechless due to an API connection error."

def fetch_live_scores():
    # Note: In a real production app, you would use an official API (like CricAPI or Sportradar).
    # Scraping HTML directly is brittle and often violates TOS, so this is just an educational example.

    # We'll use a placeholder structure here to demonstrate how a Hugging Face agent might return data.
    # Replace URL with the actual target URL.
    url = "https://www.espncricinfo.com/live-cricket-score"

    try:
        # Mocking headers to act like a regular browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        # Uncomment below to actually fetch. We are generating mock data for safety and reliability in this example.
        # response = requests.get(url, headers=headers)
        # response.raise_for_status()
        # soup = BeautifulSoup(response.text, 'html.parser')

        # This is where your actual scraping logic would go.
        # For example: soup.find('div', class_='match-score-block')

        # Simulated scraped data:
        data = {
            "match": "Karachi Kings vs Lahore Qalandars",
            "tournament": "PSL 2026",
            "score": "185/4 (18.2 ov)",
            "status": "Karachi Kings need 12 runs in 10 balls",
            "timestamp": time.time()
        }

        # Call the Gemini AI function to get insights
        data["ai_insight"] = generate_ai_commentary(data)

        # Save to JSON file
        with open("live_score.json", "w") as f:
            json.dump(data, f, indent=4)

        print("Live score and AI insight updated successfully.")
        return data

    except Exception as e:
        print(f"Error fetching scores: {e}")
        # Write error state to JSON so the frontend doesn't crash
        error_data = {"error": "Could not fetch live scores at this time."}
        with open("live_score.json", "w") as f:
            json.dump(error_data, f)
        return error_data

if __name__ == "__main__":
    fetch_live_scores()
