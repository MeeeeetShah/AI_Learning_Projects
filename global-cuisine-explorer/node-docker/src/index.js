const path = require('path');
const dotenv = require('dotenv');

// 1. Load local subfolder .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 2. Load root monorepo .env (fallback if key not found locally)
dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: false });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env'), override: false });

const { run } = require('@backroad/backroad');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

const {
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
} = require('../constants/cuisine_constants');

/**
 * Factory function to instantiate the LLM based on provider configuration.
 */
function createLLMInstance(provider, modelName, apiKey) {
  const normProvider = (provider || DEFAULT_AI_PROVIDER).toLowerCase();

  if (normProvider === 'groq') {
    try {
      const { ChatGroq } = require('@langchain/groq');
      return new ChatGroq({
        model: modelName || DEFAULT_GROQ_MODEL,
        apiKey,
        temperature: 0.7,
      });
    } catch (e) {
      const { ChatOpenAI } = require('@langchain/openai');
      return new ChatOpenAI({
        modelName: modelName || DEFAULT_GROQ_MODEL,
        openAIApiKey: apiKey,
        configuration: {
          baseURL: GROQ_BASE_URL,
        },
        temperature: 0.7,
      });
    }
  } else if (normProvider === 'openai') {
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({
      modelName: modelName || DEFAULT_OPENAI_MODEL,
      openAIApiKey: apiKey,
      temperature: 0.7,
    });
  } else {
    const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
    return new ChatGoogleGenerativeAI({
      modelName: modelName || DEFAULT_AI_MODEL,
      apiKey,
      temperature: 0.7,
    });
  }
}


// Backroad Server-Driven UI (Node.js equivalent to Streamlit)
run(
  async (br) => {
    // Environment Resolution Flow: Local .env -> Monorepo Root .env
    const envApiKey = process.env.AI_API_KEY || process.env.GOOGLE_API_KEY || '';
    const aiModel = process.env.AI_MODEL || process.env.GEMINI_MODEL || DEFAULT_AI_MODEL;
    const aiProvider = process.env.AI_PROVIDER || DEFAULT_AI_PROVIDER;

    br.write({ body: '# LangChain JS Cuisine Explorer' });
    br.write({
      body: `*Powered by Node.js, Backroad UI Framework & Multi-LLM Architecture (Provider: \`${aiProvider.toUpperCase()}\`, Model: \`${aiModel}\`)*`,
    });

    // Key Status Indicator
    if (envApiKey) {
      br.write({
        body: `> **SECURE:** AI API Key loaded from environment (.env). Key is active and masked.`,
      });
    } else {
      br.write({
        body: `> **WARNING:** No AI API Key found in local or root .env environment. Please provide key below.`,
      });
    }

    // User Inputs: Country Dropdown & Optional Custom Input
    const selectedCountryOption = br.select({
      label: 'Select a Country',
      options: COUNTRY_OPTIONS,
      defaultValue: DEFAULT_COUNTRY,
    });

    let country = selectedCountryOption;
    if (selectedCountryOption === CUSTOM_COUNTRY_OPTION) {
      country = br.textInput({
        label: 'Enter Custom Country Name',
        defaultValue: DEFAULT_CUSTOM_COUNTRY,
      });
    }

    // Process Guidance Box based on Selected Country
    br.write({
      body: `> **Target Country**: \`${country}\`\n>\n> **Execution Plan**:\n> 1. **Chain 1**: Predicts/Generates an iconic restaurant concept for **${country}**, identifying the best suited city & ideal ambiance/vibe.\n> 2. **Chain 2**: Curates 4 tailored menu dishes (Starter, Main Course, Dessert, Beverage) with explicit dietary tags (\`Vegan\`, \`Vegetarian\`, \`Non-Vegetarian\`, \`Eggitarian\`) & proper key ingredients.`,
    });

    const overrideKey = br.textInput({
      label: envApiKey ? 'Override AI API Key (Optional)' : 'Enter AI API Key',
      type: 'password',
    });

    const effectiveKey = (overrideKey && overrideKey.trim()) ? overrideKey.trim() : envApiKey;

    const isClicked = br.button({ label: 'Explore Cuisine & Generate Menu with LangChain' });

    if (isClicked) {
      if (!effectiveKey) {
        br.write({
          body: `**ERROR:** Please provide an AI API Key or configure \`AI_API_KEY\` in your \`.env\` file.`,
        });
        return;
      }

      if (!country) {
        br.write({ body: `**ERROR:** Please enter a country name.` });
        return;
      }

      br.setValue('pipeline_running', true);

      try {
        const llm = createLLMInstance(aiProvider, aiModel, effectiveKey);
        const parser = new StringOutputParser();

        // Chain 1 Prompts & Execution
        const restaurantPrompt = PromptTemplate.fromTemplate(RESTAURANT_PROMPT_TEMPLATE);
        const chain1 = restaurantPrompt.pipe(llm).pipe(parser);
        const restaurantResult = await chain1.invoke({ country });

        // Chain 2 Prompts & Execution
        const dishPrompt = PromptTemplate.fromTemplate(DISH_PROMPT_TEMPLATE);
        const chain2 = dishPrompt.pipe(llm).pipe(parser);
        const dishesResult = await chain2.invoke({
          country,
          restaurant_info: restaurantResult,
        });

        br.setValue('pipeline_result', {
          country,
          restaurantResult,
          dishesResult,
          error: null,
        });
      } catch (err) {
        br.setValue('pipeline_result', {
          country,
          restaurantResult: null,
          dishesResult: null,
          error: err.message || String(err),
        });
      } finally {
        br.setValue('pipeline_running', false);
      }
    }

    // Persistently display result on screen
    const currentResult = br.getOrDefault('pipeline_result', null);
    const isRunning = br.getOrDefault('pipeline_running', false);

    if (isRunning) {
      br.write({ body: `---` });
      br.write({ body: `**Running LangChain Sequential Pipeline for ${country}...**` });
    } else if (currentResult) {
      br.write({ body: `---` });
      if (currentResult.error) {
        br.write({ body: `**EXECUTION ERROR:** ${currentResult.error}` });
      } else {
        br.write({ body: `### Chain 1 Output: Restaurant Concept & Suited City/Ambiance` });
        br.write({ body: `\`\`\`text\n${currentResult.restaurantResult}\n\`\`\`` });

        br.write({ body: `### Chain 2 Output: Recommended Menu (4 Dishes with Dietary Types)` });
        br.write({ body: `\`\`\`text\n${currentResult.dishesResult}\n\`\`\`` });

        br.write({ body: `**SUCCESS:** LangChain Sequential Execution Completed Successfully!` });
      }
    }
  },
  {
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_SERVER_PORT,
    },
  }
);
