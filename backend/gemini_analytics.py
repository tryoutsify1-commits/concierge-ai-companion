import os
from flask import Flask
# 1. Import the new Google GenAI Client
from google import genai
from google.genai import types

app = Flask(__name__)

@app.route('/')
def home():
    return "Gemini Analytics Pipeline is Live!"

# =====================================================================
# 🚀 UPDATED GEMINI ANALYSIS LOGIC (Using new google-genai SDK)
# =====================================================================

def analyze_guest_trends(messy_chat_logs: str):
    """
    Utilizes Gemini 1.5 Flash to sweep through raw chat history,
    categorize customer complaints, and output structured JSON data.
    """
    # Initialize the new client (it automatically looks for your GEMINI_API_KEY environment variable)
    client = genai.Client()
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=messy_chat_logs,
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are an advanced corporate business analyst. Scan the provided raw "
                "hotel chat logs. Count and classify customer needs into categories: "
                "'Maintenance', 'Room Service', 'Complaints', or 'Inquiries'. "
                "Output your final calculations strictly as a clean JSON object."
            )
        )
    )
    return response.text

# Quick pipeline test run on startup
try:
    sample_log = "Guest in Room 304 requested extra towels at 9 PM. Room 215 complained AC is broken."
    analysis_result = analyze_guest_trends(sample_log)
    print("\n--- Initial Pipeline Analytics Test Run ---")
    print(analysis_result)
    print("-------------------------------------------\n")
except Exception as e:
    print(f"\n❌ Pipeline test error: {e}\n")

# =====================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
