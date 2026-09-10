import os
import streamlit as st
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from langchain_openai import ChatOpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

# Load environment variables from local .env AND root monorepo .env
load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

st.set_page_config(
    page_title="Global Cuisine Explorer (LangChain + Multi-LLM)",
    layout="wide"
)

# Custom CSS Styling
st.markdown("""
    <style>
    .main-header {
        font-size: 2.4rem;
        font-weight: 800;
        color: #f8fafc;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #94a3b8;
        margin-bottom: 1.5rem;
    }
    .chain-badge {
        background: #2b2b40;
        color: #ff8e53;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
        margin-bottom: 0.8rem;
    }
    .restaurant-card {
        background-color: #1E1E2E;
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 5px solid #FF6B6B;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    .dish-card {
        background-color: #252538;
        border-radius: 12px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        border: 1px solid #33334d;
        line-height: 1.6;
    }
    </style>
""", unsafe_allow_html=True)

# Retrieve generic environment configurations
env_api_key = os.getenv("AI_API_KEY", "").strip() or os.getenv("GOOGLE_API_KEY", "").strip()
ai_model = os.getenv("AI_MODEL", "").strip() or os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
ai_provider = os.getenv("AI_PROVIDER", "google").strip().lower()

# Sidebar Configuration (Generic AI Provider Setup)
st.sidebar.title("AI Configuration")
st.sidebar.markdown(f"**Provider**: `{ai_provider.upper()}`")
st.sidebar.markdown(f"**Model**: `{ai_model}`")

effective_api_key = ""

if env_api_key:
    st.sidebar.success("SECURE: AI API Key loaded from environment (.env)")
    st.sidebar.caption("Key is active and masked for security.")
    override_key = st.sidebar.text_input(
        "Override AI API Key (Optional)",
        type="password",
        help="Leave blank to use the secure environment key."
    )
    effective_api_key = override_key.strip() if override_key.strip() else env_api_key
else:
    st.sidebar.warning("WARNING: No AI API Key found in .env environment!")
    manual_key = st.sidebar.text_input(
        "Enter AI API Key",
        type="password",
        help="Provide your API key for the selected AI provider."
    )
    effective_api_key = manual_key.strip()

st.sidebar.markdown("---")
st.sidebar.info(
    "LangChain Sequential Pipeline:\n\n"
    "1. Chain 1: Country -> Restaurant Concept, Suited City & Ambiance\n"
    "2. Chain 2: Restaurant Concept -> 4 Recommended Dishes (Vegan, Veg, Non-Veg, Eggitarian)"
)

# Main Header
st.markdown('<div class="main-header">LangChain Cuisine Explorer</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Powered by LangChain Sequential Chains and Multi-LLM Provider Architecture</div>', unsafe_allow_html=True)

# User Input
country_options = ["Italy", "India", "Japan", "Mexico", "France", "Thailand", "Spain", "Greece", "Custom"]
selected_country_option = st.selectbox("Select a Country", country_options)

if selected_country_option == "Custom":
    country = st.text_input("Enter any Country Name", "Brazil")
else:
    country = selected_country_option

# Process Guidance Box based on Selected Country
st.info(
    f"**Target Country**: `{country}`\n\n"
    f"**Execution Plan**:\n"
    f"1. **Chain 1**: Predicts/Generates an iconic restaurant concept for **{country}**, identifying the best suited city & ideal ambiance/vibe.\n"
    f"2. **Chain 2**: Curates 4 tailored menu dishes (Starter, Main Course, Dessert, Beverage) with explicit dietary tags (`Vegan`, `Vegetarian`, `Non-Vegetarian`, `Eggitarian`) & proper key ingredients."
)

def get_llm_instance(provider: str, model: str, key: str):
    """
    Factory function to instantiate the LLM based on provider configuration.
    """
    p = (provider or "google").lower()
    if p == "groq":
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(model=model, groq_api_key=key, temperature=0.7)
        except ImportError:
            if HAS_OPENAI:
                return ChatOpenAI(
                    model_name=model,
                    openai_api_key=key,
                    openai_api_base="https://api.groq.com/openai/v1",
                    temperature=0.7
                )
            else:
                raise ImportError("langchain_groq or langchain_openai package required for Groq provider.")
    elif p == "openai":
        if not HAS_OPENAI:
            raise ImportError("langchain_openai package required for OpenAI provider.")
        return ChatOpenAI(model_name=model, openai_api_key=key, temperature=0.7)
    else:
        return ChatGoogleGenerativeAI(
            model=model,
            google_api_key=key,
            temperature=0.7
        )

# Action Button & Verbose Pipeline Execution
if st.button("Explore Cuisine & Generate Menu with LangChain", type="primary"):
    if not effective_api_key:
        st.warning("WARNING: Please provide an AI API Key in the sidebar or set AI_API_KEY in .env")
    else:
        with st.status(f"Running LangChain Sequential Pipeline for {country}...", expanded=True) as status_box:
            try:
                llm = get_llm_instance(ai_provider, ai_model, effective_api_key)
                
                # --- Step 1: Chain 1 Execution ---
                status_box.write("Step 1/2: Executing Chain 1 (Restaurant Concept, Suited City & Ambiance)...")
                restaurant_prompt = PromptTemplate(
                    input_variables=["country"],
                    template="""You are an expert culinary concept strategist and restaurateur.
Given the country "{country}", generate a unique or iconic restaurant concept suited for this country.

Provide your response strictly in the following format:
Restaurant Name: <Name of the Restaurant>
Best Suited City: <Best Suited City in {country}>
Ideal Ambiance & Vibe: <Detailed Ambiance & Atmosphere Description>
Cuisine Specialty & Theme: <Specialty & Culinary Focus>
Target Audience: <Target Customer Base>
"""
                )
                chain1 = restaurant_prompt | llm | StrOutputParser()
                restaurant_out = chain1.invoke({"country": country})
                status_box.write("Step 1 Completed: Restaurant Concept & Suited City Generated!")
                
                # --- Step 2: Chain 2 Execution ---
                status_box.write("Step 2/2: Executing Chain 2 (Curating 4 Dishes with Dietary Types)...")
                dish_prompt = PromptTemplate(
                    input_variables=["country", "restaurant_info"],
                    template="""You are a world-class executive chef. Based on this restaurant concept in {country}:

{restaurant_info}

Curate 4 recommended dishes (Starter, Main Course, Dessert, Beverage) that should be added to this restaurant's menu.
Ensure you include dietary tags (Vegan, Vegetarian, Non-Vegetarian, or Eggitarian) for each dish.

Provide your response strictly in the following format:

Dish 1: <Dish Name>
Dietary Tag: <Vegan / Vegetarian / Non-Vegetarian / Eggitarian>
Category: <Starter / Main Course / Dessert / Beverage>
Description: <2-3 sentences description>
Key Ingredients: <List of proper ingredients>

Dish 2: <Dish Name>
Dietary Tag: <Vegan / Vegetarian / Non-Vegetarian / Eggitarian>
Category: <Starter / Main Course / Dessert / Beverage>
Description: <2-3 sentences description>
Key Ingredients: <List of proper ingredients>

Dish 3: <Dish Name>
Dietary Tag: <Vegan / Vegetarian / Non-Vegetarian / Eggitarian>
Category: <Starter / Main Course / Dessert / Beverage>
Description: <2-3 sentences description>
Key Ingredients: <List of proper ingredients>

Dish 4: <Dish Name>
Dietary Tag: <Vegan / Vegetarian / Non-Vegetarian / Eggitarian>
Category: <Starter / Main Course / Dessert / Beverage>
Description: <2-3 sentences description>
Key Ingredients: <List of proper ingredients>
"""
                )
                chain2 = dish_prompt | llm | StrOutputParser()
                dishes_out = chain2.invoke({"country": country, "restaurant_info": restaurant_out})
                status_box.write("Step 2 Completed: 4 Menu Dishes Curated Successfully!")
                
                status_box.update(label=f"Pipeline Completed Successfully for {country}!", state="complete", expanded=False)
                
                # --- Render Outputs ---
                st.markdown('<div class="chain-badge">Chain 1 Output: Restaurant Concept & Suited City/Ambiance</div>', unsafe_allow_html=True)
                st.markdown(f'<div class="restaurant-card">{restaurant_out.replace("\n", "<br/>")}</div>', unsafe_allow_html=True)
                
                st.markdown('<div class="chain-badge">Chain 2 Output: Recommended Menu (4 Dishes with Dietary Types)</div>', unsafe_allow_html=True)
                st.markdown(f'<div class="dish-card">{dishes_out.replace("\n", "<br/>")}</div>', unsafe_allow_html=True)
                
                st.success("LangChain Sequential Execution Completed Successfully!")
                
            except Exception as e:
                status_box.update(label="Pipeline Execution Failed!", state="error", expanded=True)
                st.error(f"LangChain Execution Error: {str(e)}")
                st.info("Check if your AI_API_KEY is valid for the selected provider.")
