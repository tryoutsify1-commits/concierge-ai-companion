import os
import time
from flask import Flask
import google.generativeai as genai

# 1. Start a tiny web server for Render's health checks
app = Flask(__name__)

@app.route('/')
def home():
    return "Gemini Analytics Pipeline is Live!"

# =====================================================================
# 🚀 YOUR GEMINI ANALYSIS LOGIC
# =====================================================================

# Authenticate using your secure Google AI Studio key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def analyze_guest_trends(messy_chat_logs: str):
    """
    Utilizes Gemini's high context window to sweep through raw chat history,
    categorize customer complaints, and output structured JSON data for dashboards.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=(
            "You are an advanced corporate business analyst. Scan the provided raw "
            "hotel chat logs. Count and classify customer needs into categories: "
            "'Maintenance', 'Room Service', 'Complaints', or 'Inquiries'. "
            "Output your final calculations strictly as a clean JSON object."
        )
    )
    
    response = model.generate_content(messy_chat_logs)
    return response.text

# Sample run or placeholder execution so it shows up in your initial logs
try:
    sample_log = "Guest in Room 304 requested extra towels at 9 PM. Room 215 complained AC is broken."
    analysis_result = analyze_guest_trends(sample_log)
    print("\n--- Initial Pipeline Analytics Test Run ---")
    print(analysis_result)
    print("-------------------------------------------\n")
except Exception as e:
    print(f"Pipeline running. Awaiting input data stream... (Status: {e})")

# =====================================================================

# 2. Tell the script to listen on the port Render assigns it
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
