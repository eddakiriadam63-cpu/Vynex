# Discipline — Starter Web App (React + Vite)

This is a minimal, privacy-first starter for the *Discipline* app you requested.
It focuses on a single-user, offline-capable (PWA) web app with local storage and
an initial implementation of flashcards + SRS.

## Quick start

1. Download and unzip the project.
2. Install dependencies:
   ```
   npm install
   ```
3. Run dev server:
   ```
   npm run dev
   ```
4. Open the local URL shown by Vite (use your phone using the computer IP to test mobile).

## Build
```
npm run build
```

## Notes & next steps

- AI features are **optional** and disabled by default. When ready, you can add an OpenAI API key in Settings and implement calls in `src/lib/ai.js`.
- Media handling uses browser APIs and localForage. Very large files may hit browser storage limits.
- PWA: service worker and manifest included; further tuning for caching strategies recommended.
- This is a starter repo. If you want, I can extend the app with:
  - Full AI integration (requires an API key)
  - PDF text extraction using `pdfjs-dist`
  - OCR with `tesseract.js`
  - Calendar integration and browser notifications

If you'd like the complete production-ready version I can continue and add more features, or I can walk you through deploying it to GitHub Pages / Netlify and configuring your domain.


## AI & Transcription Notes

- OpenAI API: go to Settings in the app and paste your API key (`sk-...`). The key is stored locally in your browser.
- Video/audio transcription uses OpenAI Whisper via `transcribeAudio` in `src/lib/ai.js`.
- Costs: generating flashcards and transcriptions will consume tokens and may incur charges on your OpenAI account.

