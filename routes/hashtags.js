const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    // Call AI to generate hashtags
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a social media assistant that generates hashtags.",
        },
        {
          role: "user",
          content: `Generate 10 trending and relevant hashtags for: ${keyword}`,
        },
      ],
    });

    // Extract hashtags from response
    const hashtagsText = response.choices[0].message.content;
    const hashtags = hashtagsText
      .split(/\s+/) // split by spaces/newlines
      .filter(tag => tag.startsWith("#"));

    res.json({ hashtags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI hashtag generation failed" });
  }
});

module.exports = router;
