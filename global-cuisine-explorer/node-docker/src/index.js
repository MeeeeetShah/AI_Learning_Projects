const express = require('express');
const app = express();

const PORT = process.env.PORT || 7860;

const cuisineData = {
  "Italy": {
    flag: "🇮🇹",
    capital: "Rome",
    restaurant: {
      name: "Osteria Francescana",
      city: "Modena",
      rating: "⭐⭐⭐⭐⭐ (3 Michelin Stars)",
      specialty: "Modern Italian Gastronomy",
      ambiance: "Intimate & Art-infused"
    },
    dishes: [
      {
        name: "Neapolitan Pizza Margherita",
        type: "Main Course",
        ingredients: ["San Marzano Tomatoes", "Fresh Mozzarella di Bufala", "Fresh Basil", "Olive Oil"],
        description: "The classic Italian pizza featuring a chewy blistered crust, sweet tomato sauce, and creamy mozzarella."
      },
      {
        name: "Tagliatelle al Ragù alla Bolognese",
        type: "Pasta",
        ingredients: ["Fresh Egg Tagliatelle", "Slow-cooked Beef & Pork", "Pancetta", "Parmigiano"],
        description: "Silky homemade egg pasta ribbons tossed in a rich, slow-simmered meat sauce."
      }
    ]
  },
  "India": {
    flag: "🇮🇳",
    capital: "New Delhi",
    restaurant: {
      name: "Bukhara",
      city: "New Delhi",
      rating: "⭐⭐⭐⭐⭐ (Iconic North Indian Dining)",
      specialty: "Tandoori & Slow-Cooked Dal",
      ambiance: "Rustic Clay Oven Experience"
    },
    dishes: [
      {
        name: "Butter Chicken (Murgh Makhani)",
        type: "Curry / Main",
        ingredients: ["Tandoori Chicken", "Tomato Gravy", "Butter & Cream", "Kasuri Methi"],
        description: "Tender charcoal-grilled chicken simmered in a rich tomato and butter sauce."
      },
      {
        name: "Dal Bukhara / Makhani",
        type: "Lentil Specialty",
        ingredients: ["Black Lentils", "Garlic & Ginger", "Slow-simmered 18 hours", "Fresh Cream"],
        description: "Whole black lentils slow-cooked overnight over charcoal, creating a creamy texture."
      }
    ]
  },
  "Japan": {
    flag: "🇯🇵",
    capital: "Tokyo",
    restaurant: {
      name: "Sukiyabashi Jiro",
      city: "Tokyo",
      rating: "⭐⭐⭐⭐⭐ (World Famous Edomae Sushi)",
      specialty: "Omakase Nigiri Sushi",
      ambiance: "Minimalist Master Craftsmanship"
    },
    dishes: [
      {
        name: "Otoro Nigiri (Fatty Tuna Sushi)",
        type: "Seafood / Nigiri",
        ingredients: ["Bluefin Tuna Belly", "Vinegared Shari Rice", "Real Wasabi", "House Shoyu"],
        description: "Melt-in-your-mouth premium tuna belly served over warm sushi rice."
      },
      {
        name: "Tonkotsu Ramen",
        type: "Noodle Soup",
        ingredients: ["Pork Bone Broth", "Ramen Noodles", "Chashu Pork Belly", "Ajitsuke Tamago"],
        description: "Deeply savory, milky pork broth paired with springy noodles and soft-boiled egg."
      }
    ]
  },
  "Mexico": {
    flag: "🇲🇽",
    capital: "Mexico City",
    restaurant: {
      name: "Pujol",
      city: "Mexico City",
      rating: "⭐⭐⭐⭐⭐ (Top 10 World's Best)",
      specialty: "Elevated Traditional Mexican",
      ambiance: "Modern & Earthy"
    },
    dishes: [
      {
        name: "Tacos al Pastor",
        type: "Street Food / Main",
        ingredients: ["Marinated Pork", "Achiote & Spices", "Roasted Pineapple", "Corn Tortilla"],
        description: "Thinly sliced spit-roasted pork marinated in achiote and chiles with sweet pineapple."
      },
      {
        name: "Mole Madre",
        type: "Traditional Sauce",
        ingredients: ["100+ Ingredients", "Mexican Chocolate", "Mulato Chiles", "Nuts & Seeds"],
        description: "A complex Mexican sauce aged for hundreds of days to develop rich chocolate and chili notes."
      }
    ]
  }
};

app.use(express.json());

// API Endpoint
app.get('/api/cuisine', (req, res) => {
  res.json(cuisineData);
});

// Interactive HTML Frontend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Global Cuisine Explorer (Node.js + Docker)</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background: #0f0f17; color: #e2e8f0; margin: 0; padding: 2rem; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { background: linear-gradient(90deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.2rem; margin-bottom: 0.5rem; }
        .subtitle { color: #94a3b8; margin-bottom: 2rem; }
        select { background: #1e1e2e; color: #fff; border: 1px solid #334155; padding: 0.8rem 1.2rem; border-radius: 8px; font-size: 1rem; width: 100%; margin-bottom: 2rem; outline: none; }
        .card { background: #181825; border-radius: 12px; padding: 1.5rem; border: 1px solid #27273a; margin-bottom: 1.5rem; }
        .restaurant { border-left: 4px solid #818cf8; }
        .dishes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .tag { background: #2a2a40; color: #38bdf8; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 4px; display: inline-block; margin-top: 4px; }
        .badge { background: #312e81; color: #c7d2fe; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🐳 Global Cuisine Explorer</h1>
        <div class="subtitle">Node.js + Docker Containerized App (Listening on Port ${PORT})</div>
        
        <label for="countrySelect"><b>Select Country:</b></label>
        <select id="countrySelect" onchange="renderCuisine()">
          ${Object.keys(cuisineData).map(country => `<option value="${country}">${cuisineData[country].flag} ${country}</option>`).join('')}
        </select>

        <div id="content"></div>
      </div>

      <script>
        const data = ${JSON.stringify(cuisineData)};

        function renderCuisine() {
          const selected = document.getElementById('countrySelect').value;
          const country = data[selected];
          const content = document.getElementById('content');

          content.innerHTML = \`
            <div class="card restaurant">
              <h2>📍 Top Restaurant: \${country.restaurant.name} (\${country.restaurant.city})</h2>
              <p><b>Rating:</b> \${country.restaurant.rating}</p>
              <p><b>Specialty:</b> \${country.restaurant.specialty}</p>
              <p><b>Ambiance:</b> \${country.restaurant.ambiance}</p>
            </div>

            <h3>🍲 Popular Iconic Dishes (Menu Highlights)</h3>
            <div class="dishes-grid">
              \${country.dishes.map((dish, i) => \`
                <div class="card">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="margin:0; color:#38bdf8;">Dish #\${i+1}: \${dish.name}</h4>
                    <span class="badge">\${dish.type}</span>
                  </div>
                  <p style="color:#cbd5e1; font-size:0.95rem;">\${dish.description}</p>
                  <div>
                    <small><b>Ingredients:</b></small><br/>
                    \${dish.ingredients.map(ing => \`<span class="tag">\${ing}</span>\`).join('')}
                  </div>
                </div>
              \`).join('')}
            </div>
          \`;
        }

        renderCuisine();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
