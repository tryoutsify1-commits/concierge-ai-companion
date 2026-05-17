import os
from flask import Flask
from google import genai

app = Flask(__name__)

@app.route('/')
def home():
    return "Gemini Analytics Pipeline is Live!"

# =====================================================================
# 🚀 FULLY FIXING THE CONFIG PAYLOAD
# =====================================================================

def analyze_guest_trends(messy_chat_logs: str):
    """
    Utilizes Gemini 1.5 Flash to sweep through raw chat history,
    categorize customer complaints, and output structured JSON data.
    """
    # Enforce stable v1 routing
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
        http_options={"api_version": "v1"}
    )
    
    # Passing the config as a clean dictionary avoids the SDK payload mapping issue
    config = {
        "system_instruction": (
            "You are an advanced corporate business analyst. Scan the provided raw "
            "hotel chat logs. Count and classify customer needs into categories: "
            "'Maintenance', 'Room Service', 'Complaints', or 'Inquiries'. "
            "Output your final calculations strictly as a clean JSON object."
        )
    }
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=messy_chat_logs,
        config=config
    )
    return response.text

# Quick pipeline test run on startup to verify deployment output
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
