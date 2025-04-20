import os
import json
import random # Import the requests library to make HTTP requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

load_dotenv()

# The Juz mapping as defined in your JavaScript code.
juz_mapping = {
    1: [{"surah": 1, "start": 1, "end": 7}, {"surah": 2, "start": 1, "end": 141}],
    2: [{"surah": 2, "start": 142, "end": 252}],
    3: [{"surah": 2, "start": 253, "end": 286}, {"surah": 3, "start": 1, "end": 92}],
    4: [{"surah": 3, "start": 93, "end": 200}, {"surah": 4, "start": 1, "end": 23}],
    5: [{"surah": 4, "start": 24, "end": 147}],
    6: [{"surah": 4, "start": 148, "end": 176}, {"surah": 5, "start": 1, "end": 81}],
    7: [{"surah": 5, "start": 82, "end": 120}, {"surah": 6, "start": 1, "end": 110}],
    8: [{"surah": 6, "start": 111, "end": 165}, {"surah": 7, "start": 1, "end": 87}],
    9: [{"surah": 7, "start": 88, "end": 206}, {"surah": 8, "start": 1, "end": 40}],
    10: [{"surah": 8, "start": 41, "end": 75}, {"surah": 9, "start": 1, "end": 93}],
    11: [{"surah": 9, "start": 94, "end": 129}, {"surah": 10, "start": 1, "end": 109}],
    12: [{"surah": 11, "start": 1, "end": 123}, {"surah": 12, "start": 1, "end": 52}],
    13: [{"surah": 12, "start": 53, "end": 111}, {"surah": 13, "start": 1, "end": 43}, {"surah": 14, "start": 1, "end": 52}],
    14: [{"surah": 15, "start": 1, "end": 99}, {"surah": 16, "start": 1, "end": 128}],
    15: [{"surah": 17, "start": 1, "end": 111}, {"surah": 18, "start": 1, "end": 74}],
    16: [{"surah": 18, "start": 75, "end": 110}, {"surah": 19, "start": 1, "end": 98}, {"surah": 20, "start": 1, "end": 135}],
    17: [{"surah": 21, "start": 1, "end": 112}, {"surah": 22, "start": 1, "end": 78}],
    18: [{"surah": 23, "start": 1, "end": 118}, {"surah": 24, "start": 1, "end": 64}],
    19: [{"surah": 25, "start": 1, "end": 77}, {"surah": 26, "start": 1, "end": 227}],
    20: [{"surah": 27, "start": 1, "end": 93}, {"surah": 28, "start": 1, "end": 55}],
    21: [{"surah": 28, "start": 56, "end": 88}, {"surah": 29, "start": 1, "end": 69}, {"surah": 30, "start": 1, "end": 60}],
    22: [{"surah": 33, "start": 31, "end": 30}, {"surah": 33, "start": 31, "end": 73}, {"surah": 34, "start": 1, "end": 54}],
    23: [{"surah": 36, "start": 28, "end": 83}, {"surah": 37, "start": 1, "end": 182}],
    24: [{"surah": 38, "start": 1, "end": 88}, {"surah": 39, "start": 1, "end": 31}],
    25: [{"surah": 39, "start": 32, "end": 75}, {"surah": 40, "start": 1, "end": 85}, {"surah": 41, "start": 1, "end": 46}],
    26: [{"surah": 41, "start": 47, "end": 54}, {"surah": 42, "start": 1, "end": 53}, {"surah": 43, "start": 1, "end": 89}],
    27: [{"surah": 44, "start": 1, "end": 59}, {"surah": 45, "start": 1, "end": 37}, {"surah": 46, "start": 1, "end": 35}],
    28: [{"surah": 47, "start": 1, "end": 38}, {"surah": 48, "start": 1, "end": 29}, {"surah": 49, "start": 1, "end": 18}, {"surah": 50, "start": 1, "end": 45}, {"surah": 51, "start": 1, "end": 30}],
    29: [{"surah": 67, "start": 1, "end": 30}, {"surah": 68, "start": 1, "end": 52}, {"surah": 69, "start": 1, "end": 52}, {"surah": 70, "start": 1, "end": 44}],
    30: [{"surah": 78, "start": 1, "end": 40}, {"surah": 79, "start": 1, "end": 46}, {"surah": 80, "start": 1, "end": 42},
         {"surah": 81, "start": 1, "end": 29}, {"surah": 82, "start": 1, "end": 19}, {"surah": 83, "start": 1, "end": 36},
         {"surah": 84, "start": 1, "end": 25}, {"surah": 85, "start": 1, "end": 22}]
}

def parse_juz_input(juz_input):
    """
    Given a string such as "1,2-4", returns a list of integers.
    """
    if not juz_input:
        raise ValueError("Juz input is undefined or null.")
    
    result = []
    for part in juz_input.split(','):
        part = part.strip()
        if '-' in part:
            start_str, end_str = part.split('-')
            start = int(start_str.strip())
            end = int(end_str.strip())
            result.extend(range(start, end + 1))
        else:
            result.append(int(part))
    return result

def get_verse_by_chapter_and_verse(quran_data, chapter, verse):
    """
    Searches the quran_data (assumed to be a dict with surah numbers as keys)
    for a verse with the specified chapter and verse numbers.
    """
    # Try to retrieve the surah using an int key or a string key.
    surah = quran_data.get(chapter) or quran_data.get(str(chapter))
    if not surah:
        return None
    for v in surah:
        if v.get("verse") == verse:
            return v
    return None

@app.route('/api/verse', methods=['GET'])
def handler():
    try:
        # Retrieve query parameters
        chapters = request.args.get('chapters')
        chapter_param = request.args.get('chapter')
        verse_param = request.args.get('verse')

        if not chapters:
            raise ValueError("Chapters query parameter is missing or invalid.")

        # Parse the chapters query parameter into a list of juz numbers.
        juz_numbers = parse_juz_input(chapters)

        # Load the Quran and translation data synchronously.
        base_dir = os.path.join(os.getcwd(), "data")
        with open(os.path.join(base_dir, "quran.json"), "r", encoding="utf-8") as f:
            quran = json.load(f)
        with open(os.path.join(base_dir, "translate.json"), "r", encoding="utf-8") as f:
            translation = json.load(f)

        verse_data = None

        # If specific chapter and verse query parameters are provided, attempt a direct lookup.
        if chapter_param and verse_param:
            try:
                chapter_int = int(chapter_param)
                verse_int = int(verse_param)
                verse_data = get_verse_by_chapter_and_verse(quran, chapter_int, verse_int)
            except ValueError:
                return jsonify({"error": "Chapter or verse query parameter is not a valid number."}), 400

        # If no direct verse lookup succeeded, select a verse from the specified Juz ranges.
        if not verse_data:
            selected_verses = []
            for juz in juz_numbers:
                if juz in juz_mapping:
                    for rng in juz_mapping[juz]:
                        surah_num = rng["surah"]
                        # Try to get the surah verses using either int or string key.
                        surah_verses = quran.get(surah_num) or quran.get(str(surah_num))
                        # Find the matching surah in the translation data.
                        surah_translation = next((s for s in translation if s.get("id") == surah_num), None)
                        if surah_verses and surah_translation:
                            for verse in surah_verses:
                                verse_number = verse.get("verse", 0)
                                if rng["start"] <= verse_number <= rng["end"]:
                                    verse_translation = next(
                                        (vt for vt in surah_translation.get("verses", []) if vt.get("id") == verse_number),
                                        None
                                    )
                                    selected_verses.append({
                                        "chapter": verse.get("chapter", surah_num),
                                        "verse": verse_number,
                                        "text": verse.get("text", ""),
                                        "translation": verse_translation.get("translation") if verse_translation else "No translation available"
                                    })
            if len(selected_verses) == 0:
                return jsonify({"error": "No verses found for the selected Juz"}), 404

            verse_data = random.choice(selected_verses)

        if not verse_data:
            return jsonify({"error": "Verse not found"}), 404

        # Optionally, update the translation if it was not set.
        surah_translation = next((s for s in translation if s.get("id") == verse_data["chapter"]), None)
        verse_translation = None
        if surah_translation:
            verse_translation = next(
                (vt for vt in surah_translation.get("verses", []) if vt.get("id") == verse_data["verse"]),
                None
            )

        return jsonify({
            "chapter": verse_data["chapter"],
            "verse": verse_data["verse"],
            "text": verse_data["text"],
            "translation": verse_translation.get("translation") if verse_translation else "No translation available"
        }), 200

    except Exception as e:
        # Log the error and return a 400 error response.
        print("Error processing request:", str(e))
        return jsonify({"error": "Invalid input"}), 400

# ------------------------------------------------------------
# New route to render the frontend using Flask's template system.
# ------------------------------------------------------------

@app.route('/Quran')
def index():
    # Renders the index.html template from the templates folder.
    return render_template('index.html')

@app.route('/duas', methods=['GET'])
def get_duas():
    try:
        # Load the dua.json file
        base_dir = os.path.join(os.getcwd(), "data")
        with open(os.path.join(base_dir, "dua.json"), "r", encoding="utf-8") as f:
            dua_data = json.load(f)
        
        # Pass the duas to the dua.html template for rendering
        return render_template('dua.html', duas=dua_data["duas"])

    except Exception as e:
        print(f"Error reading dua.json: {e}")
        return render_template('error.html', message="Unable to load duas"), 500


# ------------------------------------------------------------
# New route to get the location of nearby halal restaurants.
# ------------------------------------------------------------

GOOGLE_API_KEY =  os.getenv("GOOGLE_API_KEY")
MAP_ID = os.getenv("MAP_ID")

@app.route('/get-location', methods=['POST'])
def get_location():
    """
    Receives a JSON payload containing a postcode, converts the postcode into latitude and longitude using the
    Google Geocoding API, and then uses the Google Places API to find nearby halal restaurants.
    Returns a JSON response with a success flag and an array of locations.
    """
    try:
        # Parse JSON data from the request
        data = request.get_json()
        postcode = data.get('postcode')
        if not postcode:
            return jsonify({"success": False, "message": "Postcode is required."}), 400

        # Use the Geocoding API to convert the postcode to coordinates
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={postcode}&region=uk&key={GOOGLE_API_KEY}"
        geocode_response = requests.get(geocode_url).json()

        if geocode_response.get('status') != 'OK':
            return jsonify({"success": False, "message": "Invalid postcode or address."}), 400

        # Extract latitude and longitude from the first result
        location = geocode_response['results'][0]['geometry']['location']
        latitude = location['lat']
        longitude = location['lng']

        # Use the Places API to search for nearby halal restaurants
        places_url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            f"location={latitude},{longitude}&radius=5000&keyword=halal&region=uk&key={GOOGLE_API_KEY}"
        )
        places_response = requests.get(places_url).json()

        if places_response.get('status') != 'OK':
            return jsonify({"success": False, "message": "No nearby halal locations found."}), 404
        
        # Build the list of locations with relevant details, including the place_id for further details
        locations = [
            {
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "latitude": place["geometry"]["location"]["lat"],
                "longitude": place["geometry"]["location"]["lng"],
                "place_id": place.get("place_id")
            }
            for place in places_response.get("results", [])
        ]
 
        return jsonify({"success": True, "locations": locations}) 

    except Exception as e:
        print(f"Error in get_location: {e}")
        return jsonify({"success": False, "message": "An error occurred while fetching locations."}), 500


@app.route('/get-location-coordinates', methods=['GET'])
def get_location_coordinates():
    try:
        # Retrieve latitude and longitude from query parameters
        latitude = request.args.get('lat')
        longitude = request.args.get('lng')

        # Check if both latitude and longitude are provided
        if not latitude or not longitude:
            return jsonify({"success": False, "message": "Invalid coordinates."}), 400

        print(f"Fetching locations for latitude: {latitude}, longitude: {longitude}")

        # Construct the Places API URL
        places_url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            f"?location={latitude},{longitude}&radius=5000&keyword=halal&key={GOOGLE_API_KEY}"
        )

        # Make a GET request to the Places API
        places_response = requests.get(places_url).json()

        print(f"Google Places API response: {places_response}")

        # Check if the API response is successful
        if places_response['status'] != 'OK':
            return jsonify({"success": False, "message": "No nearby halal locations found."}), 404

        # Extract relevant information from the API response
        locations = [
            {
                "name": place["name"],
                "address": place["vicinity"],
                "latitude": place["geometry"]["location"]["lat"],
                "longitude": place["geometry"]["location"]["lng"]
            }
            for place in places_response.get('results', [])
        ]

        return jsonify({"success": True, "locations": locations})

    except Exception as e:
        print(f"Error in get_location_coordinates: {e}")
        return jsonify({"success": False, "message": "An error occurred while fetching locations."}), 500


@app.route('/map')
def map_page():
    # Render the map.html template
    return render_template('map.html', google_api_key=GOOGLE_API_KEY, map_id=MAP_ID)

@app.route('/get-place-details', methods=['GET'])
def get_place_details():
    place_id = request.args.get('place_id')
    if not place_id:
        return jsonify({"success": False, "message": "Invalid place_id."}), 400

    try:
        places_details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={GOOGLE_API_KEY}"
        response = requests.get(places_details_url).json()

        if response['status'] != 'OK':
            return jsonify({"success": False, "message": "Failed to fetch place details."}), 500

        return jsonify({"success": True, "placeDetails": response['result']})
    except Exception as e:
        print(f"Error fetching place details: {e}")
        return jsonify({"success": False, "message": "An error occurred."}), 500


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/prayer')
def prayer():
    return render_template('prayer.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

