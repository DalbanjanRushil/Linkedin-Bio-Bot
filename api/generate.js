export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { name, role, skills, tone, purpose } = req.body;

  if (!name || !role || !skills || !tone || !purpose) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const prompt = `Write a ${tone.toLowerCase()} LinkedIn bio for someone named ${name}, a ${role}, skilled in ${skills}. Purpose: ${purpose}. Make it engaging and professional.`;

  try {
    const response = await fetch("https://api.deepai.org/api/text-generator", {
      method: "POST",
      headers: {
        "Api-Key": process.env.DEEPAI_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: prompt }),
    });

    const data = await response.json();

    if (!data.output) {
      return res.status(500).json({ error: "No output returned from DeepAI." });
    }

    return res.status(200).json({ result: data.output });
  } catch (err) {
    console.error("DeepAI Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
