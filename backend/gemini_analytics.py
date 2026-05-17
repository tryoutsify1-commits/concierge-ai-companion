import os
from flask import Flask, jsonify
from google import genai
from pydantic import BaseModel, Field

app = Flask(__name__)

# Initialize the new SDK client naturally
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

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
    Leverages native structured schema configurations to guarantee an
    isolated, valid JSON output string from Gemini 1.5 Flash.
    """
    prompt = (
        f"You are an advanced corporate business analyst. Scan the provided raw "
        f"hotel chat logs, extract the relevant occurrences, and structure the "
        f"output frequencies precisely following the schema.\n\n"
        f"Logs:\n{messy_chat_logs}"
    )

    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": AnalyticsResult
        }
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
        # Returns the structured string payload directly as application/json headers
        return analysis_result, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Gemini Analytics Pipeline is Live!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
