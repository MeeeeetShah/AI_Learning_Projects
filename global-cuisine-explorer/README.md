# Global Cuisine Explorer Monorepo

A multi-language monorepo showcasing LangChain 2-Step Sequential Chains for restaurant concept generation and culinary menu curation across Python (Streamlit) and Node.js (Docker + Backroad UI).

---

## Live Deployments

* **Python Streamlit App**: [Streamlit Cloud Live App](https://meeeeetshah-a-global-cuisine-explorerpython-streamlitapp-busiwd.streamlit.app/)
* **Node.js Docker App**: [Render Live App](https://global-cuisine-explorer-node.onrender.com/)

---

## Subprojects Overview

| Directory | Stack | Framework | Live Link | Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **`python-streamlit/`** | Python 3.12 | Streamlit + LangChain | [Live App](https://meeeeetshah-a-global-cuisine-explorerpython-streamlitapp-busiwd.streamlit.app/) | [Streamlit README](./python-streamlit/README.md) |
| **`node-docker/`** | Node.js 18 | Backroad UI + Docker | [Live App](https://global-cuisine-explorer-node.onrender.com/) | [Node Docker README](./node-docker/README.md) |

---

## Environment Variables Configuration

Create a `.env` file inside subfolders or use monorepo environment resolution:

```env
# AI Provider (google, groq, or openai)
AI_PROVIDER=google

# Model Name
AI_MODEL=gemini-2.5-flash

# API Key
AI_API_KEY=your_api_key_here
```

### Supported Providers & Models

* **Google Gemini**: `AI_PROVIDER=google`, `AI_MODEL=gemini-2.5-flash`
* **Groq**: `AI_PROVIDER=groq`, `AI_MODEL=groq/compound-mini` (or `llama-3.1-70b-versatile`)
* **OpenAI**: `AI_PROVIDER=openai`, `AI_MODEL=gpt-4o-mini`

---

## Quick Start (Local Execution)

### Python Streamlit App
```bash
cd python-streamlit
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

### Node.js Docker App
```bash
cd node-docker
npm install
npm start
```
Or via Docker Compose:
```bash
npm run docker:up
```

---

## Documentation Links

* [Python Streamlit Detailed README](./python-streamlit/README.md)
* [Node.js Docker Detailed README](./node-docker/README.md)
