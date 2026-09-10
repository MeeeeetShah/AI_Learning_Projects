import streamlit as st

st.set_page_config(
    page_title="Global Cuisine Explorer",
    page_icon="🍽️",
    layout="wide"
)

# Custom CSS for rich visual styling
st.markdown("""
    <style>
    .main-header {
        font-size: 2.4rem;
        font-weight: 800;
        background: linear-gradient(90deg, #FF6B6B, #FF8E53);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #888888;
        margin-bottom: 2rem;
    }
    .restaurant-card {
        background-color: #1E1E2E;
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 5px solid #FF6B6B;
        margin-bottom: 1.5rem;
    }
    .dish-card {
        background-color: #252538;
        border-radius: 12px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        border: 1px solid #33334d;
    }
    .tag {
        display: inline-block;
        background: #313244;
        color: #cdd6f4;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        margin-right: 5px;
        margin-top: 5px;
    }
    </style>
""", unsafe_allow_html=True)

# Sample Dataset: Country -> Restaurant & Top 2 Popular Dishes
CUISINE_DATA = {
    "Italy": {
        "flag": "🇮🇹",
        "capital": "Rome",
        "restaurant": {
            "name": "Osteria Francescana",
            "city": "Modena",
            "rating": "⭐⭐⭐⭐⭐ (3 Michelin Stars)",
            "specialty": "Modern Italian Gastronomy",
            "ambiance": "Intimate & Art-infused"
        },
        "dishes": [
            {
                "name": "Neapolitan Pizza Margherita",
                "type": "Main Course",
                "ingredients": ["San Marzano Tomatoes", "Fresh Mozzarella di Bufala", "Fresh Basil", "Extra Virgin Olive Oil"],
                "description": "The classic Italian pizza featuring a chewy blistered crust, sweet tomato sauce, and creamy buffalo mozzarella."
            },
            {
                "name": "Tagliatelle al Ragù alla Bolognese",
                "type": "Pasta",
                "ingredients": ["Fresh Egg Tagliatelle", "Slow-cooked Beef & Pork", "Pancetta", "Parmigiano-Reggiano"],
                "description": "Silky homemade egg pasta ribbons tossed in a rich, slow-simmered meat sauce from Bologna."
            }
        ]
    },
    "India": {
        "flag": "🇮🇳",
        "capital": "New Delhi",
        "restaurant": {
            "name": "Bukhara",
            "city": "New Delhi",
            "rating": "⭐⭐⭐⭐⭐ (Iconic North Indian Dining)",
            "specialty": "Tandoori & Slow-Cooked Dal",
            "ambiance": "Rustic Clay Oven Experience"
        },
        "dishes": [
            {
                "name": "Butter Chicken (Murgh Makhani)",
                "type": "Curry / Main",
                "ingredients": ["Tandoori Chicken", "Velvety Tomato Gravy", "Butter & Cream", "Kasuri Methi"],
                "description": "Tender charcoal-grilled chicken simmered in a mildly spiced, rich tomato and butter sauce."
            },
            {
                "name": "Dal Bukhara / Makhani",
                "type": "Lentil Specialty",
                "ingredients": ["Black Lentils", "Garlic & Ginger", "Slow-simmered 18 hours", "Fresh Cream"],
                "description": "Whole black lentils slow-cooked overnight over charcoal, creating an incredibly creamy texture."
            }
        ]
    },
    "Japan": {
        "flag": "🇯🇵",
        "capital": "Tokyo",
        "restaurant": {
            "name": "Sukiyabashi Jiro",
            "city": "Tokyo",
            "rating": "⭐⭐⭐⭐⭐ (World Famous Edomae Sushi)",
            "specialty": "Omakase Nigiri Sushi",
            "ambiance": "Minimalist Master Craftsmanship"
        },
        "dishes": [
            {
                "name": "Otoro Nigiri (Fatty Tuna Sushi)",
                "type": "Seafood / Nigiri",
                "ingredients": ["Bluefin Tuna Belly", "Vinegared Shari Rice", "Real Wasabi", "House Shoyu"],
                "description": "Melt-in-your-mouth premium tuna belly served over perfectly seasoned warm sushi rice."
            },
            {
                "name": "Tonkotsu Ramen",
                "type": "Noodle Soup",
                "ingredients": ["Rich Pork Bone Broth", "Ramen Noodles", "Chashu Pork Belly", "Ajitsuke Tamago"],
                "description": "Deeply savory, milky pork broth paired with springy noodles, soft-boiled marinated egg, and tender pork."
            }
        ]
    },
    "Mexico": {
        "flag": "🇲🇽",
        "capital": "Mexico City",
        "restaurant": {
            "name": "Pujol",
            "city": "Mexico City",
            "rating": "⭐⭐⭐⭐⭐ (Top 10 World's Best)",
            "specialty": "Elevated Traditional Mexican",
            "ambiance": "Modern & Earthy"
        },
        "dishes": [
            {
                "name": "Tacos al Pastor",
                "type": "Street Food / Main",
                "ingredients": ["Marinated Pork", "Achiote & Spices", "Roasted Pineapple", "Corn Tortilla"],
                "description": "Thinly sliced spit-roasted pork marinated in achiote and chiles, topped with sweet pineapple and fresh cilantro."
            },
            {
                "name": "Mole Madre",
                "type": "Traditional Sauce",
                "ingredients": ["100+ Ingredients", "Mexican Chocolate", "Mulato Chiles", "Nuts & Seeds"],
                "description": "A complex, aromatic Mexican sauce aged for hundreds of days to develop rich chocolate and chili notes."
            }
        ]
    },
    "France": {
        "flag": "🇫🇷",
        "capital": "Paris",
        "restaurant": {
            "name": "Le Jules Verne",
            "city": "Paris (Eiffel Tower)",
            "rating": "⭐⭐⭐⭐⭐ (1 Michelin Star with Views)",
            "specialty": "Classic French Fine Dining",
            "ambiance": "Panoramic City Lights"
        },
        "dishes": [
            {
                "name": "Coq au Vin",
                "type": "Classic Stew",
                "ingredients": ["Braised Chicken", "Burgundy Red Wine", "Lardons", "Button Mushrooms"],
                "description": "Chicken tenderly braised with red wine, lardons, garlic, and pearl onions in a savory reduced sauce."
            },
            {
                "name": "Boeuf Bourguignon",
                "type": "Beef Stew",
                "ingredients": ["Beef Chuck", "Pinot Noir", "Carrots", "Bouquet Garni"],
                "description": "Slow-braised beef stew bathed in dark wine gravy, renowned as the ultimate French comfort food."
            }
        ]
    },
    "Thailand": {
        "flag": "🇹🇭",
        "capital": "Bangkok",
        "restaurant": {
            "name": "Jay Fai",
            "city": "Bangkok",
            "rating": "⭐⭐⭐⭐⭐ (1 Michelin Star Street Food)",
            "specialty": "Wok-Fried Seafood",
            "ambiance": "Open-Air Street Kitchen"
        },
        "dishes": [
            {
                "name": "Crab Meat Omelette (Khai Jeaw Poo)",
                "type": "Seafood Specialty",
                "ingredients": ["Jumbo Lump Crab Meat", "Crispy Egg Roll", "Thai Chili Sauce"],
                "description": "A legendary golden crispy omelette packed with generous chunks of sweet jumbo lump crab meat."
            },
            {
                "name": "Tom Yum Goong",
                "type": "Hot & Sour Soup",
                "ingredients": ["River Prawns", "Lemongrass", "Galangal", "Kaffir Lime Leaves"],
                "description": "An aromatic hot and sour soup bursting with prawns, herbs, lime juice, and spicy chili paste."
            }
        ]
    }
}

# Header Section
st.markdown('<div class="main-header">🍽️ Global Cuisine & Restaurant Explorer</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Select a country to discover top restaurant recommendations and iconic local dishes!</div>', unsafe_allow_html=True)

# Sidebar Filter
st.sidebar.header("📍 Select Location")
selected_country = st.sidebar.selectbox("Choose a Country", list(CUISINE_DATA.keys()))

country_info = CUISINE_DATA[selected_country]

# Main Content Layout
col_header, col_stats = st.columns([2, 1])

with col_header:
    st.title(f"{country_info['flag']} {selected_country}")
    st.caption(f"Capital City: **{country_info['capital']}**")

with col_stats:
    st.metric(label="Total Featured Dishes", value=len(country_info["dishes"]))
    st.metric(label="Top Recommended Spot", value=country_info["restaurant"]["name"])

st.markdown("---")

# Section 1: Recommended Restaurant
st.subheader("🏬 Recommended Restaurant")
rest = country_info["restaurant"]
st.markdown(f"""
<div class="restaurant-card">
    <h3 style="margin-top:0; color:#FF8E53;">📍 {rest['name']} ({rest['city']})</h3>
    <p><b>Rating:</b> {rest['rating']}</p>
    <p><b>Culinary Specialty:</b> {rest['specialty']}</p>
    <p><b>Ambiance:</b> {rest['ambiance']}</p>
</div>
""", unsafe_allow_html=True)

# Section 2: Popular Dishes
st.subheader("🍲 Popular Iconic Dishes (Menu Highlights)")

cols = st.columns(2)
for idx, dish in enumerate(country_info["dishes"]):
    with cols[idx]:
        st.markdown(f"""
        <div class="dish-card">
            <h4 style="color:#FF6B6B; margin-top:0;">Dish #{idx+1}: {dish['name']}</h4>
            <p><b>Category:</b> {dish['type']}</p>
            <p>{dish['description']}</p>
            <div>
                <b>Key Ingredients:</b><br/>
                {''.join([f'<span class="tag">{ing}</span>' for ing in dish['ingredients']])}
            </div>
        </div>
        """, unsafe_allow_html=True)

st.sidebar.markdown("---")
st.sidebar.info("💡 **Stack**: Python + Streamlit\n\nRuns locally on port 8501 or on Streamlit Cloud.")
