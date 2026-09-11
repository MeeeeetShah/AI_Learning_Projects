/**
 * Centralized Node.js constants module for Global Cuisine Explorer.
 * Loads directly from global-cuisine-explorer/constants/cuisine_constants.json.
 */
const path = require('path');
const fs = require('fs');

const jsonPath = path.join(__dirname, 'cuisine_constants.json');
const _data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const COUNTRY_OPTIONS = (_data.COUNTRY_OPTIONS || []).map((c) => ({ label: c, value: c }));
const CUSTOM_COUNTRY_OPTION = _data.CUSTOM_COUNTRY_OPTION;
const DEFAULT_COUNTRY = _data.DEFAULT_COUNTRY;
const DEFAULT_CUSTOM_COUNTRY = _data.DEFAULT_CUSTOM_COUNTRY;
const DEFAULT_AI_PROVIDER = _data.DEFAULT_AI_PROVIDER;
const DEFAULT_AI_MODEL = _data.DEFAULT_AI_MODEL;
const DEFAULT_GROQ_MODEL = _data.DEFAULT_GROQ_MODEL;
const DEFAULT_OPENAI_MODEL = _data.DEFAULT_OPENAI_MODEL;
const GROQ_BASE_URL = _data.GROQ_BASE_URL;
const DEFAULT_SERVER_PORT = _data.DEFAULT_SERVER_PORT;
const RESTAURANT_PROMPT_TEMPLATE = _data.RESTAURANT_PROMPT_TEMPLATE;
const DISH_PROMPT_TEMPLATE = _data.DISH_PROMPT_TEMPLATE;

module.exports = {
  COUNTRY_OPTIONS,
  CUSTOM_COUNTRY_OPTION,
  DEFAULT_COUNTRY,
  DEFAULT_CUSTOM_COUNTRY,
  DEFAULT_AI_PROVIDER,
  DEFAULT_AI_MODEL,
  DEFAULT_GROQ_MODEL,
  DEFAULT_OPENAI_MODEL,
  GROQ_BASE_URL,
  DEFAULT_SERVER_PORT,
  RESTAURANT_PROMPT_TEMPLATE,
  DISH_PROMPT_TEMPLATE,
};
