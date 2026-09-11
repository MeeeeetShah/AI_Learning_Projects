"""
Centralized Python constants module for Global Cuisine Explorer.
Loads directly from global-cuisine-explorer/constants/cuisine_constants.json.
"""
import os
import json

JSON_PATH = os.path.join(os.path.dirname(__file__), "cuisine_constants.json")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    _data = json.load(f)

COUNTRY_OPTIONS = _data["COUNTRY_OPTIONS"]
CUSTOM_COUNTRY_OPTION = _data["CUSTOM_COUNTRY_OPTION"]
DEFAULT_COUNTRY = _data["DEFAULT_COUNTRY"]
DEFAULT_CUSTOM_COUNTRY = _data["DEFAULT_CUSTOM_COUNTRY"]
DEFAULT_AI_PROVIDER = _data["DEFAULT_AI_PROVIDER"]
DEFAULT_AI_MODEL = _data["DEFAULT_AI_MODEL"]
DEFAULT_GROQ_MODEL = _data["DEFAULT_GROQ_MODEL"]
DEFAULT_OPENAI_MODEL = _data["DEFAULT_OPENAI_MODEL"]
GROQ_BASE_URL = _data["GROQ_BASE_URL"]
RESTAURANT_PROMPT_TEMPLATE = _data["RESTAURANT_PROMPT_TEMPLATE"]
DISH_PROMPT_TEMPLATE = _data["DISH_PROMPT_TEMPLATE"]
