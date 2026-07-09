const fs = require("node:fs");
const path = require("node:path");
const { getProvider } = require("./ai/providers");

loadLocalEnv();

const resultsPath = path.resolve("test-results", "playwright-results.json");
const summaryPath = path.resolve("ai-triage-summary.md");
const githubSummaryPath = process.env.GITHUB_STEP_SUMMARY;
const baseUrl = process.env.BASE_URL || "https://www.rsilvafoto.com";

main().catch((error) => {
  writeSummary(`## AI Failure Triage\n\nAI triage could not run.\n\nReason: ${error.message}\n`);
  process.exitCode = 0;
});

async function main() {
  if (!fs.existsSync(resultsPath)) {
    writeSummary(
      `## AI Failure Triage\n\nSkipped: Playwright JSON results were not found at \`${relative(resultsPath)}\`.\n`
    );
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
  const failures = collectFailures(results);

  if (failures.length === 0) {
    writeSummary("## AI Failure Triage\n\nNo failed Playwright tests found. AI triage was not needed.\n");
    return;
  }

  const provider = getProvider();

  if (!provider.isConfigured()) {
    writeSummary(
      `## AI Failure Triage\n\nSkipped: AI provider \`${provider.name}\` is not configured.\n\n` +
        "Add the matching GitHub Actions secret, such as `OPENAI_API_KEY`, to enable AI summaries.\n\n" +
        renderFailureList(failures)
    );
    return;
  }

  const summary = await provider.summarize({ baseUrl, failures });

  writeSummary(`## AI Failure Triage\n\nProvider: \`${provider.name}\`\n\n${summary}\n`);
}

function collectFailures(results) {
  const failures = [];

  for (const suite of results.suites || []) {
    collectSuiteFailures(suite, [], failures);
  }

  return failures.slice(0, 20);
}

function collectSuiteFailures(suite, parentTitles, failures) {
  const suiteTitles = [...parentTitles, suite.title].filter(Boolean);

  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const failedResults = (test.results || []).filter((result) => result.status !== "passed");

      for (const result of failedResults) {
        failures.push({
          title: [...suiteTitles, spec.title].join(" > "),
          project: test.projectName,
          status: result.status,
          durationMs: result.duration,
          error: simplifyError(result.error),
          attachments: (result.attachments || []).map((attachment) => ({
            name: attachment.name,
            contentType: attachment.contentType,
            path: attachment.path ? relative(path.resolve(attachment.path)) : undefined,
          })),
        });
      }
    }
  }

  for (const childSuite of suite.suites || []) {
    collectSuiteFailures(childSuite, suiteTitles, failures);
  }
}

function simplifyError(error) {
  if (!error) {
    return undefined;
  }

  return {
    message: error.message,
    stack: error.stack ? error.stack.split("\n").slice(0, 12).join("\n") : undefined,
  };
}

function renderFailureList(failures) {
  const lines = ["Detected failures:"];

  for (const failure of failures) {
    lines.push(`- ${failure.project}: ${failure.title} (${failure.status})`);
  }

  return `${lines.join("\n")}\n`;
}

function writeSummary(markdown) {
  fs.writeFileSync(summaryPath, markdown);

  if (githubSummaryPath) {
    fs.appendFileSync(githubSummaryPath, `${markdown}\n`);
  }

  process.stdout.write(markdown);
}

function relative(filePath) {
  return path.relative(process.cwd(), filePath).replaceAll("\\", "/");
}

function loadLocalEnv() {
  const envPath = path.resolve(".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}
