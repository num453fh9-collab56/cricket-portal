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

        # Initialize the model using gemini-2.5-flash which is available in the list
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            # Test if model is available
            model.generate_content("test")
        except:
            print("gemini-1.5-flash not found or error, falling back to gemini-2.5-flash")
            model = genai.GenerativeModel('gemini-2.5-flash')

        prompt = f"Write exactly 1 sentence of savage, humorous cricket commentary or prediction for this match situation: {match_data.get('match', 'Unknown Match')}. Current score: {match_data.get('score', 'N/A')}. Situation: {match_data.get('status', 'Unknown')}."

        # Call the API
        response = model.generate_content(prompt)

        # Return the generated text, stripped of any leading/trailing whitespace or newlines
        return response.text.strip()

    except Exception as e:
        print(f"Error generating AI commentary: {e}")
        return "AI is currently speechless due to an API connection error."

def extract_match_data(match_div):
    """Helper to extract data from a match div on Cricbuzz"""
    try:
        # Extract Match Header (Tournament, Match No, Venue)
        header = match_div.find('div', class_='cb-lv-scrs-col')
        header_text = header.find('span', class_='text-gray').text.strip() if header and header.find('span', class_='text-gray') else "International Cricket"

        # Extract Match Title
        match_title_elem = match_div.find('h3', class_='cb-lv-scr-mtch-hdr')
        if not match_title_elem:
            match_title_elem = match_div.find('a', class_='cb-lv-scrs-well-live')
            if not match_title_elem:
                 # Fallback if both above fail
                 title_elem = match_div.find('div', class_='cb-lv-scrs-col')
                 if title_elem and title_elem.find('a'):
                     match_title_elem = title_elem.find('a')

        match_title = match_title_elem.text.strip() if match_title_elem else "Live Match"

        # Extract Score
        score_elem = match_div.find('div', class_='cb-scr-wll-chvrn')
        if score_elem:
            bat_tm = score_elem.find('div', class_='cb-hmng-bat-tm')
            bowl_tm = score_elem.find('div', class_='cb-hmng-bowl-tm')

            score_parts = []
            if bat_tm: score_parts.append(bat_tm.text.strip())
            if bowl_tm: score_parts.append(bowl_tm.text.strip())

            score_text = " - ".join(score_parts) if score_parts else "Score unavailable"
        else:
            # Fallback for different cricbuzz layout
            bat_score = match_div.find('div', class_='cb-hmng-bat-tm')
            bowl_score = match_div.find('div', class_='cb-hmng-bowl-tm')
            if bat_score and bowl_score:
                score_text = f"{bat_score.text.strip()} - {bowl_score.text.strip()}"
            elif bat_score:
                score_text = bat_score.text.strip()
            else:
                 score_text = "Score unavailable"

        # Extract Status
        status_elem = match_div.find('div', class_='cb-text-live')
        if not status_elem:
            status_elem = match_div.find('div', class_='cb-text-complete')
        if not status_elem:
            status_elem = match_div.find('div', class_='cb-text-preview')

        status = status_elem.text.strip() if status_elem else "Match Ongoing"

        return {
            "match": match_title,
            "tournament": header_text,
            "score": score_text,
            "status": status,
            "timestamp": time.time()
        }
    except Exception as e:
        print(f"Error parsing individual match: {e}")
        return None

def fetch_live_scores():
    url = "https://www.cricbuzz.com/cricket-match/live-scores"

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }

        print(f"Fetching from {url}...")
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Cricbuzz live matches container
       match_blocks = soup.find_all('div', class_=lambda c: c and 'cb-tms-itm' in str(c))

        all_matches = []

        for block in match_blocks:
            match_data = extract_match_data(block)
            if match_data:
                # Add AI insight for each match
                match_data["ai_insight"] = generate_ai_commentary(match_data)
                all_matches.append(match_data)

        if not all_matches:
            print("Could not parse any matches from the page.")
            all_matches = [{
                "match": "No Matches Found",
                "tournament": "N/A",
                "score": "N/A",
                "status": "Check back later or check Cricbuzz layout",
                "timestamp": time.time(),
                "ai_insight": "AI is currently speechless due to lack of matches."
            }]

        # Save to JSON file at project root (where the frontend looks for it)
        output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "live_score.json")
        # Also save to current directory for safety
        local_output_path = "live_score.json"

        with open(output_path, "w") as f:
            json.dump(all_matches, f, indent=4)

        with open(local_output_path, "w") as f:
            json.dump(all_matches, f, indent=4)

        print(f"Total {len(all_matches)} matches updated successfully. Saved to {output_path}")
        return all_matches

    except Exception as e:
        print(f"Error fetching scores: {e}")
        error_data = [{
            "match": "Error Fetching Data",
            "tournament": "System Error",
            "score": "N/A",
            "status": f"Scraping failed: {str(e)[:50]}...",
            "ai_insight": "The scraper encountered an error.",
            "timestamp": time.time()
        }]

        output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "live_score.json")
        with open(output_path, "w") as f:
            json.dump(error_data, f, indent=4)

        with open("live_score.json", "w") as f:
            json.dump(error_data, f, indent=4)

        return error_data

if __name__ == "__main__":
    fetch_live_scores()
