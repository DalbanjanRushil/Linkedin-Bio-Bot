document.getElementById("bioForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();
  const skills = document.getElementById("skills").value.trim();
  const tone = document.getElementById("tone").value;
  const purpose = document.getElementById("purpose").value;

  const output = document.getElementById("output");
  const resultText = document.getElementById("resultText");
  output.style.display = "block";
  resultText.innerText = "⏳ Generating your bio...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, role, skills, tone, purpose }),
    });

    const data = await response.json();
    resultText.innerText = data.result || "❌ Failed to generate bio. Try again.";
  } catch (err) {
    resultText.innerText = "❌ Error connecting to backend.";
    console.error(err);
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const text = document.getElementById("resultText").innerText;
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard ✅");
});
