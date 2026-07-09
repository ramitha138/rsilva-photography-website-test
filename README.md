# R.Silva Photography Website Test

Separate black-box Playwright automation framework for the R.Silva Photography website.

The website source code is intentionally not included here. This repo tests the public site the same way a user would, through a browser.

## Target Website

Default target:

```text
https://www.rsilvafoto.com
```

Override it with `BASE_URL`:

```powershell
$env:BASE_URL = "http://localhost:8080"
npm test
```

For macOS/Linux:

```bash
BASE_URL=http://localhost:8080 npm test
```

## Install

```bash
npm install
npm run install:browsers
```

## Run Tests

```bash
npm test
```

Run with the Playwright UI:

```bash
npm run test:e2e:ui
```

Run headed:

```bash
npm run test:headed
```

Show the latest HTML report:

```bash
npm run test:report
```

## AI Failure Triage

The framework can optionally summarize failed Playwright runs with AI. Playwright still controls pass/fail; AI output is advisory.

Local setup uses `.env.local`, which is ignored by Git:

```text
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your-local-key
```

Run triage after a test run:

```bash
npm run ai:triage
```

Provider support:

- `openai` is implemented first.
- Anthropic, Gemini, and OpenRouter can be added later through `scripts/ai/providers/` without changing the tests.

For GitHub Actions, add `OPENAI_API_KEY` under:

```text
Settings -> Secrets and variables -> Actions -> Secrets
```

Optional Actions variables:

```text
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4.1-mini
```

## Coverage

- Homepage smoke checks
- SEO metadata checks
- Mobile navigation checks
- Portfolio lightbox checks
- Contact/social link checks
- Static asset availability checks
- Accessibility checks with axe

## CI

GitHub Actions runs the suite:

- On push to `main`
- On pull requests
- Daily on a schedule
- Manually with an optional custom `BASE_URL`

Failed runs upload the Playwright HTML report, traces, screenshots, and videos where available.
