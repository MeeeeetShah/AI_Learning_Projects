# Python Streamlit Cuisine Explorer

A 2-step LangChain sequential chain application built with Python and Streamlit to predict restaurant concepts and curate 4-course menus with dietary tags based on selected countries.

## Live Application

* **Live Demo**: [Streamlit App Link](https://meeeeetshah-a-global-cuisine-explorerpython-streamlitapp-busiwd.streamlit.app/)

---

## Features

* **Sequential LangChain Pipeline**:
  * **Chain 1**: Inputs country name and generates a restaurant concept, best-suited city, ideal ambiance/vibe, and target audience.
  * **Chain 2**: Takes Chain 1 output and curates 4 dishes (Starter, Main Course, Dessert, Beverage) with explicit dietary tags (`Vegan`, `Vegetarian`, `Non-Vegetarian`, `Eggitarian`) and key ingredients.
* **Multi-LLM Support**: Supports Google Gemini, Groq (Llama 3 open source models), and OpenAI.
* **Interactive UI**: Includes country selection dropdown, custom input option, and persistent session rendering.

---

## Local Setup & Run

### Prerequisites

* Python 3.10+
* Virtual Environment (`venv`)

### Installation Steps

1. Navigate to the project directory:
   ```bash
   cd global-cuisine-explorer/python-streamlit
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `.env`:
   ```env
   AI_PROVIDER=google
   AI_MODEL=gemini-2.5-flash
   AI_API_KEY=your_api_key_here
   ```
   *(Or for Groq: `AI_PROVIDER=groq`, `AI_MODEL=groq/compound-mini`, `AI_API_KEY=gsk_...`)*

5. Run the Streamlit application:
   ```bash
   streamlit run app.py
   ```
   The application will launch locally at `http://localhost:8501`.

---

## Deployment Guide (Streamlit Community Cloud)

1. Push your code to a GitHub repository.
2. Sign in to [share.streamlit.io](https://share.streamlit.io/).
3. Click **New app** and select your repository.
4. Set **Main file path**: `global-cuisine-explorer/python-streamlit/app.py`
5. Under **Advanced settings... -> Secrets**, add:
   ```toml
   AI_PROVIDER = "google"
   AI_MODEL = "gemini-2.5-flash"
   AI_API_KEY = "your_api_key_here"
   ```
6. Click **Deploy**.

---

## Project Structure

```text
python-streamlit/
├── app.py              # Main Streamlit application
├── requirements.txt    # Project dependencies
├── .env.example        # Environment variable template
└── README.md           # Project documentation
```

## Related Links

* [Central Monorepo README](../README.md)
* [Node.js Docker Documentation](../node-docker/README.md)
