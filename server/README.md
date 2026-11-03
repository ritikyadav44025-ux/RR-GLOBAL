# RR GLOBAL — RR AI API

This is the server-side API for the RR AI chat prototype. It keeps the Gemini API key on the server and never sends it to browser code.

## Environment variables

- `GEMINI_API_KEY`: secret Gemini API key (add only in the hosting provider's secret/environment settings).
- `ALLOWED_ORIGIN`: exact deployed RR GLOBAL website origin, for example `https://ritikyadav44025-ux.github.io`.
- `PORT`: supplied automatically by most hosting providers; defaults to 3000 locally.

## Run

```sh
npm install
GEMINI_API_KEY=your_key ALLOWED_ORIGIN=https://ritikyadav44025-ux.github.io npm start
```

Do not commit a real API key to GitHub or put it in HTML/JavaScript. Keep the project on Google's Free Tier and do not enable paid billing unless an adult account holder has reviewed and approved it.

The frontend must be configured with this service's deployed URL before live chat is enabled. Until then, the static GitHub Pages demo remains in prototype mode.
