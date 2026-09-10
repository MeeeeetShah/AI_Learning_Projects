# Node.js Docker Cuisine Explorer

A dockerized Node.js application built with Backroad server-driven UI framework and LangChain JS, featuring a 2-step sequential pipeline for restaurant concepts and 4-course menu curation.

## Live Application

* **Live Demo**: [Render App Link](https://global-cuisine-explorer-node.onrender.com/)

---

## Features

* **Sequential LangChain JS Pipeline**:
  * **Chain 1**: Inputs country name and generates a restaurant concept, best-suited city, ideal ambiance/vibe, and target audience.
  * **Chain 2**: Takes Chain 1 output and curates 4 dishes (Starter, Main Course, Dessert, Beverage) with explicit dietary tags (`Vegan`, `Vegetarian`, `Non-Vegetarian`, `Eggitarian`) and key ingredients.
* **Server-Driven Web Interface**: Built with `@backroad/backroad` on top of Node.js and Express.
* **Docker Containerized**: Alpine-based Docker image for easy cloud deployment.

---

## Local Setup & Run

### Prerequisites

* Node.js 18+
* Docker & Docker Compose (optional for containerized execution)

### Option 1: Running Locally (Node.js)

1. Navigate to the project directory:
   ```bash
   cd global-cuisine-explorer/node-docker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=7860
   AI_PROVIDER=google
   AI_MODEL=gemini-2.5-flash
   AI_API_KEY=your_api_key_here
   ```

4. Start the application:
   ```bash
   npm start
   ```
   Open `http://localhost:7860` in your web browser.

---

### Option 2: Running with Docker Compose

1. Build and start the container:
   ```bash
   npm run docker:up
   ```
   *(Or run `docker compose up --build`)*

2. Open `http://localhost:7860` in your web browser.

3. Stop the container:
   ```bash
   docker compose down
   ```

---

## Deployment Guide (Render)

1. Sign in to [dashboard.render.com](https://dashboard.render.com/).
2. Create a **New Web Service** and connect your GitHub repository.
3. Configure settings:
   * **Root Directory**: `global-cuisine-explorer/node-docker`
   * **Runtime**: `Docker`
   * **Dockerfile Path**: `Dockerfile`
   * **Docker Build Context**: `.`
4. Add Environment Variables:
   * `PORT`: `7860`
   * `AI_PROVIDER`: `google` *(or `groq`)*
   * `AI_MODEL`: `gemini-2.5-flash` *(or `groq/compound-mini`)*
   * `AI_API_KEY`: `your_api_key_here`
5. Click **Create Web Service**.

---

## Project Structure

```text
node-docker/
├── src/
│   └── index.js        # Main Backroad server & LangChain pipeline
├── Dockerfile          # Docker container definition
├── docker-compose.yml  # Local Docker Compose configuration
├── package.json        # Node dependencies & npm scripts
├── .env.example        # Environment variable template
└── README.md           # Project documentation
```

## Related Links

* [Central Monorepo README](../README.md)
* [Python Streamlit Documentation](../python-streamlit/README.md)
