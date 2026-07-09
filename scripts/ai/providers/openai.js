const name = "openai";

function isConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

async function summarize({ baseUrl, failures }) {
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a senior QA automation engineer. Produce concise, evidence-based Playwright failure triage. Do not invent facts. Treat AI output as advisory only.",
        },
        {
          role: "user",
          content: buildPrompt({ baseUrl, failures }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed with ${response.status}: ${body.slice(0, 500)}`);
  }

  const data = await response.json();
  const text = extractResponseText(data);

  if (!text) {
    throw new Error("OpenAI response did not include summary text.");
  }

  return text;
}

function buildPrompt({ baseUrl, failures }) {
  return `Target site: ${baseUrl}

Summarize these failed Playwright tests in Markdown.

For each failure include:
- likely category: product defect, test bug, flaky/network issue, accessibility issue, or environment/config issue
- probable cause
- next action

Keep it short and practical.

Failures:
${JSON.stringify(failures, null, 2)}`;
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n")
    .trim();
}

module.exports = {
  name,
  isConfigured,
  summarize,
};
