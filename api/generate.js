export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed.' });
  }

  const { name, role, skills, tone, purpose } = req.body;

  if (!name || !role || !skills || !tone || !purpose) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const prompt = `Write a ${tone.toLowerCase()} LinkedIn description for someone named ${name}, who is a ${role}. Their skills include: ${skills}. This should be written for the purpose of: ${purpose}. Make it engaging and professional.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const generatedText = data.choices[0].message.content.trim();
    return res.status(200).json({ result: generatedText });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
