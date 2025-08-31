import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

// --- Cache ---
// Simple in-memory cache to store API results and avoid rate-limiting.
const cache = new Map();

app.use(cors());
app.use(express.json());

// --- Ollama (Local AI Model) Functions ---

function createOllamaHashtagPrompt(keyword) {
  return `
    You are a social media expert. Your task is to generate 15 hashtags for the keyword: "${keyword}".
    Format the output as a single JSON array of strings, like ["#hashtag1", "#hashtag2"].
    Do not include any other text or explanations in your response. Just the JSON array.
  `.trim();
}

/**
 * Generates a list of 10 hashtags for a specific category using the AI model.
 * @param {string} category The category to generate hashtags for.
 * @returns {Promise<string[]>} A promise that resolves to an array of hashtags.
 */
async function generateHashtagsForCategory(category) {
  const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
  const finalPrompt = `
  You are a social media expert. Your task is to generate a list of 10 popular and relevant hashtags for a specific category.

  The category is: "${category}"

  Return the result as a single, valid JSON array of 10 strings. The hashtags should not include the '#' symbol. Do not include any introductory text, explanations, or markdown formatting. Your response must be ONLY the JSON array.
  For example, for the category "travel", the output should be similar to: ["travelgram", "instatravel", "wanderlust", "travelblogger", "vacation", "explore", "adventure", "holiday", "travelphotography", "tourist"]
  `.trim();

  const payload = {
    model: 'llama3',
    prompt: finalPrompt,
    stream: false
  };

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }
    const data = await response.json();
    return JSON.parse(data.response);
  } catch (error) {
    console.error(`Error generating hashtags for category ${category}:`, error);
    return []; // Return an empty array on failure
  }
}


// --- RapidAPI Functions ---

async function fetchTrendingHashtags() {
  const CACHE_KEY = "trendingHashtags";
  if (cache.has(CACHE_KEY)) {
    console.log("Returning trending hashtags from cache.");
    return cache.get(CACHE_KEY);
  }

  const API_KEY = process.env.RAPIDAPI_KEY;
  if (!API_KEY) {
    throw new Error("RapidAPI key is not configured. Please check your .env file.");
  }

  const url = 'https://hash-tag-generator.p.rapidapi.com/get_has_tags?query=trending&language=en';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'hash-tag-generator.p.rapidapi.com'
    }
  };

  try {
    console.log(`Fetching new trending hashtags from: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status !== 200 || !data.status) {
        console.error("RapidAPI Error Body:", data);
        throw new Error(`RapidAPI request failed: ${response.statusText}`);
    }

    console.log("Received data structure from RapidAPI:", data);
    
    const hashtags = data.data.results;

    if (!Array.isArray(hashtags)) {
        throw new Error("Failed to parse hashtags from the new API response. Expected data.data.results to be an array.");
    }
    
    const cleanedHashtags = hashtags.map(tag => tag.startsWith('#') ? tag.slice(1) : tag);

    cache.set(CACHE_KEY, cleanedHashtags);
    setTimeout(() => cache.delete(CACHE_KEY), 3600000); // 1-hour cache

    return cleanedHashtags;

  } catch (error) {
    console.error("Error in fetchTrendingHashtags:", error);
    throw error;
  }
}


// --- API Endpoints ---

app.post("/api/hashtags/generate", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
  const finalPrompt = createOllamaHashtagPrompt(keyword);
  const payload = { model: 'llama3', prompt: finalPrompt, stream: false };

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);
    
    const data = await response.json();
    const hashtags = JSON.parse(data.response);
    res.json({ hashtags });
  } catch (error) {
    console.error("Error calling Ollama or parsing response:", error);
    res.status(500).json({ error: "Failed to generate hashtags." });
  }
});

app.get("/api/hashtags/trending/top:count", async (req, res) => {
  const count = parseInt(req.params.count, 10);
  if (isNaN(count) || count <= 0) {
      return res.status(400).json({ error: "A valid count is required." });
  }

  try {
      const hashtags = await fetchTrendingHashtags();
      res.json({ hashtags: hashtags.slice(0, count) });
  } catch (err) {
      res.status(500).json({ error: "Failed to fetch trending hashtags." });
  }
});

app.get("/api/hashtags/trending/categorized", async (req, res) => {
  const CACHE_KEY = "categorizedHashtags";
  if (cache.has(CACHE_KEY)) {
    console.log("Returning categorized hashtags from cache.");
    return res.json(cache.get(CACHE_KEY));
  }

  try {
    const categories = ["music", "entertainment", "sports", "news", "fashion", "technology", "travel", "food", "art", "health", "lifestyle", "business", "education"];
    const categorizedHashtags = {};

    const promises = categories.map(async (category) => {
      const hashtags = await generateHashtagsForCategory(category);
      if (hashtags && hashtags.length > 0) {
        categorizedHashtags[category] = hashtags;
      }
    });

    await Promise.all(promises);
    
    cache.set(CACHE_KEY, categorizedHashtags);
    setTimeout(() => cache.delete(CACHE_KEY), 3600000); // 1-hour cache

    res.json(categorizedHashtags);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate categorized hashtags." });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

