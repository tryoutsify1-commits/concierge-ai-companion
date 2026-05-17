import os
from flask import Flask, jsonify
from google import genai
from google.genai import types  # Import the official SDK types
from pydantic import BaseModel, Field

app = Flask(__name__)

# Initialize the client naturally (grabs GEMINI_API_KEY from environment)
client = genai.Client()

# =====================================================================
# 📊 STRUCTURED RESPONSE DATA MODEL
# =====================================================================

class AnalyticsResult(BaseModel):
    Maintenance: int = Field(description="Count of incidents regarding broken equipment or fixes.")
    Room_Service: int = Field(alias="Room Service", default=0, description="Count of requests for items, food, or amenities.")
    Complaints: int = Field(description="Count of general customer grievances or negative feedback.")
    Inquiries: int = Field(description="Count of standard policy questions, check-out times, or info updates.")

# =====================================================================
# 🚀 CORE DATA ANALYSIS PIPELINE
# =====================================================================

def analyze_guest_trends(messy_chat_logs: str) -> str:
    """
    Uses the official GenerateContentConfig helper to perfectly structure
    and map the Pydantic schema for the Gemini API call.
    """
    prompt = (
        f"You are an advanced corporate business analyst. Scan the provided raw "
        f"hotel chat logs, count the relevant occurrences, and structure the "
        f"output frequencies precisely following the schema.\n\n"
        f"Logs:\n{messy_chat_logs}"
    )

    # Use the official type helper so the SDK knows exactly how to parse the schema properties
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=AnalyticsResult,
    )

    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt,
        config=config
    )
    
    return response.text

# =====================================================================
# 🔌 LIVE TESTING ROUTE
# =====================================================================

@app.route('/test-analysis')
def test_analysis():
    try:
        sample_log = (
            "Guest in Room 304 requested extra towels at 9 PM. "
            "Room 215 complained AC is broken. Room 102 asked about checkout time."
        )
        analysis_result = analyze_guest_trends(sample_log)
        return analysis_result, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Gemini Analytics Pipeline is Live!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
