import os
from flask import Flask, jsonify
from google import genai

app = Flask(__name__)

# Global client routing safely to the production endpoint
client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY"),
    http_options={"api_version": "v1"}
)

@app.route('/')
def home():
    return "Gemini Analytics Pipeline is Live!"

# =====================================================================
# 🚀 CORE DATA ANALYSIS PIPELINE (Clean JSON Version)
# =====================================================================

def analyze_guest_trends(messy_chat_logs: str):
    """
    Injects instructions natively and strips any markdown wrappers
    to ensure clean JSON data delivery.
    """
    system_prompt = (
        "You are an advanced corporate business analyst. Scan the provided raw "
        "hotel chat logs. Count and classify customer needs into categories: "
        "'Maintenance', 'Room Service', 'Complaints', or 'Inquiries'. "
        "Output your final calculations strictly as a clean JSON object."
    )
    
    contents = [
        {"role": "system", "parts": [{"text": system_prompt}]},
        {"role": "user", "parts": [{"text": messy_chat_logs}]}
    ]
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=contents
    )
    
    raw_text = response.text.strip()
    
    # Clean off any markdown wrapping code blocks if the model generates them
    if raw_text.startswith("```"):
        # Strip off the top line (like ```json) and the bottom backticks
        lines = raw_text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].startswith("```"):
            lines = lines[:-1]
        raw_text = "\n".join(lines).strip()
        
    return raw_text

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
        # Returns the raw clean string explicitly marked as an application/json header
        return analysis_result, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
