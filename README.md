# 🏨 Concierge AI Companion & Analytics Pipeline

An enterprise-grade, multi-cloud AI solution designed for luxury hospitality management. This project features a decoupled architecture consisting of an interactive user dashboard and an automated backend data pipeline powered by **Google Gemini** and **Azure AI Foundry**.

---

## 🚀 Key Features
* **Stateless Guest Interface:** A sleek, modern frontend designed to simulate a premium guest interaction system.
* **Autonomous AI Analytics Engine:** Utilizing the high context window of **Gemini 2.5 Flash** to scan raw, unstructured hotel chat history and parse it into perfectly structured business telemetry (JSON).
* **Enterprise Multi-Cloud Infrastructure:** Isolated backend logic built with Python and environment-based access keys for maximum security.

---

## 🏗️ System Architecture

The application separates concerns by decoupling the client presentation layer from the core data processing engines: [ Lovable Frontend UI Layer ] ➔ (User Interaction / Simulated Chat)
│
▼ (Secure API Pipeline)
[ Backend Analytics Server ] ➔ (Python Engine running Gemini 2.5 Flash) ➔ Output (Structured JSON)

---

## 🛠️ Tech Stack & Services

* **Language:** Python 3.13+
* **Core Frameworks:** Google Generative AI SDK, FastAPI, Pydantic
* **Cloud Architecture:** Google AI Studio (Gemini Engine) & Azure AI Services
* **Deployment Ready:** Configured for environment-isolated server hosting (Render / Vercel)

---
## 💻 Local Quickstart & Verification

### 1. Configure Secret Environments
Store your cloud credentials securely in your terminal environment before starting the service to protect sensitive keys:

```powershell
$env:GEMINI_API_KEY="your_api_key_here"
