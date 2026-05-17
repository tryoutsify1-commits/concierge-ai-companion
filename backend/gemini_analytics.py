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
# 🚀 CORE DATA ANALYSIS PIPELINE (Role-Based Structural Override)
# =====================================================================

def analyze_guest_trends(messy_chat_logs: str):
    """
    Injects the corporate instructions natively into the contents array
    as a 'system' role block, completely avoiding the buggy config parser.
    """
    system_prompt = (
        "You are an advanced corporate business analyst. Scan the provided raw "
        "hotel chat logs. Count and classify customer needs into categories: "
        "'Maintenance', 'Room Service', 'Complaints', or 'Inquiries'. "
        "Output your final calculations strictly as a clean JSON object."
    )
    
    # Passing both the role-based prompt and data inside the contents list
    contents = [
        {"role": "system", "parts": [{"text": system_prompt}]},
        {"role": "user", "parts": [{"text": messy_chat_logs}]}
    ]
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=contents
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
