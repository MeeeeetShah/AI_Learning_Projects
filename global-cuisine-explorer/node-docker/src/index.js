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

/**
 * Factory function to instantiate the LLM based on provider configuration.
 */
function createLLMInstance(provider, modelName, apiKey) {
  const normProvider = (provider || 'google').toLowerCase();

  if (normProvider === 'groq') {
    try {
      const { ChatGroq } = require('@langchain/groq');
      return new ChatGroq({
        model: modelName || 'llama-3.1-70b-versatile',
        apiKey,
        temperature: 0.7,
      });
    } catch (e) {
      const { ChatOpenAI } = require('@langchain/openai');
      return new ChatOpenAI({
        modelName: modelName || 'llama-3.1-70b-versatile',
        openAIApiKey: apiKey,
        configuration: {
          baseURL: 'https://api.groq.com/openai/v1',
        },
        temperature: 0.7,
      });
    }
  } else if (normProvider === 'openai') {
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({
      modelName: modelName || 'gpt-4o-mini',
      openAIApiKey: apiKey,
      temperature: 0.7,
    });
  } else {
    const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
    return new ChatGoogleGenerativeAI({
      modelName: modelName || 'gemini-2.5-flash',
      apiKey,
      temperature: 0.7,
    });
  }
}

/**
 * Executes a 2-step Sequential Chain using LangChain:
 * Chain 1: Country -> Restaurant Concept, Suited City & Ambiance
 * Chain 2: Restaurant Concept -> 4 Recommended Dishes (Vegan/Veg/Non-Veg/Eggitarian)
 */
async function runLangChainSequentialPipeline(country, apiKey, provider, modelName) {
  const llm = createLLMInstance(provider, modelName, apiKey);

  // Chain 1: Recommend Restaurant Concept, Suited City & Ambiance
  const restaurantPrompt = PromptTemplate.fromTemplate(
    `You are an expert culinary concept strategist and restaurateur.
Given the country "{country}", generate a unique or iconic restaurant concept suited for this country.

Provide your response strictly in the following format:
Restaurant Name: <Name of the Restaurant>
Best Suited City: <Best Suited City in {country}>
Ideal Ambiance & Vibe: <Detailed Ambiance & Atmosphere Description>
Cuisine Specialty & Theme: <Specialty & Culinary Focus>
Target Audience: <Target Customer Base>`
  );

  // Chain 2: Recommend 4 Dishes with Dietary Types based on Chain 1 output
  const dishPrompt = PromptTemplate.fromTemplate(
    `You are a world-class executive chef. Based on this restaurant concept in {country}:

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
Key Ingredients: <List of proper ingredients>`
  );

  const parser = new StringOutputParser();

  // Execute Chain 1
  const chain1 = restaurantPrompt.pipe(llm).pipe(parser);
  const restaurantResult = await chain1.invoke({ country });

  // Execute Chain 2 with Chain 1 output
  const chain2 = dishPrompt.pipe(llm).pipe(parser);
  const dishesResult = await chain2.invoke({
    country,
    restaurant_info: restaurantResult,
  });

  return { restaurantResult, dishesResult };
}

// Backroad Server-Driven UI (Node.js equivalent to Streamlit)
run(
  async (br) => {
    // Environment Resolution Flow: Local .env -> Monorepo Root .env
    const envApiKey = process.env.AI_API_KEY || process.env.GOOGLE_API_KEY || '';
    const aiModel = process.env.AI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const aiProvider = process.env.AI_PROVIDER || 'google';

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
    const countryOptions = [
      { label: "Italy", value: "Italy" },
      { label: "India", value: "India" },
      { label: "Japan", value: "Japan" },
      { label: "Mexico", value: "Mexico" },
      { label: "France", value: "France" },
      { label: "Thailand", value: "Thailand" },
      { label: "Spain", value: "Spain" },
      { label: "Greece", value: "Greece" },
      { label: "Custom", value: "Custom" },
    ];
    const selectedCountryOption = br.select({
      label: 'Select a Country',
      options: countryOptions,
      defaultValue: 'Japan',
    });

    let country = selectedCountryOption;
    if (selectedCountryOption === 'Custom') {
      country = br.textInput({
        label: 'Enter Custom Country Name',
        defaultValue: 'Brazil',
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
        const restaurantPrompt = PromptTemplate.fromTemplate(
          `You are an expert culinary concept strategist and restaurateur.
Given the country "{country}", generate a unique or iconic restaurant concept suited for this country.

Provide your response strictly in the following format:
Restaurant Name: <Name of the Restaurant>
Best Suited City: <Best Suited City in {country}>
Ideal Ambiance & Vibe: <Detailed Ambiance & Atmosphere Description>
Cuisine Specialty & Theme: <Specialty & Culinary Focus>
Target Audience: <Target Customer Base>`
        );

        const chain1 = restaurantPrompt.pipe(llm).pipe(parser);
        const restaurantResult = await chain1.invoke({ country });

        // Chain 2 Prompts & Execution
        const dishPrompt = PromptTemplate.fromTemplate(
          `You are a world-class executive chef. Based on this restaurant concept in {country}:

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
Key Ingredients: <List of proper ingredients>`
        );

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
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 7860,
    },
  }
);
