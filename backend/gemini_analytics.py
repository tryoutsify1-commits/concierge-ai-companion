import os
import google.generativeai as genai

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
