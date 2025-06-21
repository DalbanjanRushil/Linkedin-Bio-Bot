export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { name, role, skills, tone, purpose } = req.body;

  if (!name || !role || !skills || !tone || !purpose) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const prompt = `Write a ${tone.toLowerCase()} LinkedIn bio for ${name}, a ${role}, skilled in ${skills}. Purpose: ${purpose}. Make it engaging, clear, and professional.`;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command", // cohere's default model
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.generations && data.generations[0].text) {
      return res.status(200).json({ result: data.generations[0].text.trim() });
    } else {
      console.error("Cohere Error:", data);
      return res.status(500).json({ error: "Failed to generate bio." });
    }
  } catch (err) {
    console.error("Cohere Exception:", err);
    return res.status(500).json({ error: "Internal Server Error (Cohere)" });
  }
}
