# Clip Finder

> AI-powered tool that turns long-form video transcripts into short-form clip suggestions.

**Live demo:** [clip-finder-ai.vercel.app](https://clip-finder-ai.vercel.app)

## What it does

Content creators producing short-form video for TikTok, Reels, or Shorts spend hours scrubbing through long-form transcripts looking for clip-worthy moments. This tool does that automatically — paste a transcript with timestamps, pick a style (funny, inspirational, educational, viral, or custom), and get back 3–6 structured clip suggestions with timestamps, hooks, transcript excerpts, virality reasoning, and suggested captions.

## Why I built it

I produce short-form content across TikTok and Instagram and this is a workflow problem I actually have. Building it also gave me a chance to get hands-on with the modern Next.js App Router and Anthropic's tool use API — both newer territory for me — and to ship a real product end-to-end rather than another local-only project.

## How it works

**User flow:**

1. Paste a transcript with timestamps, or load one of the preloaded examples
2. Pick a clip style (preset or custom prompt)
3. Submit → Claude analyses the transcript and returns structured clip suggestions
4. Each suggested clip displays timestamps, title, excerpt, reasoning, and a copyable social caption

**Under the hood:**

- The form validates the transcript on the client (length and timestamp detection) for fast feedback
- A POST request hits the Next.js Route Handler at `/api/find-clips`
- The route handler re-validates server-side (defence in depth) and calls Claude via the Anthropic SDK
- Claude is forced into structured JSON output using the tool use API — much more reliable than prompting for JSON in plain text
- The tool output is validated against a Zod schema before being returned to the client
- The frontend renders each clip as a card with a copy-to-clipboard caption

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Anthropic SDK** with Claude Sonnet 4.5 for clip extraction
- **Zod** for runtime validation on both client and server
- **Vercel** for hosting

## Key engineering decisions

**Tool use over plain-text JSON.** Asking a model to "return JSON" in a system prompt is brittle — it sometimes wraps the response in markdown, adds a preamble, or hallucinates fields. Claude's tool use API forces the model to call a defined tool with arguments matching a strict JSON schema, then I validate the result with Zod as a belt-and-braces check.

**Defence-in-depth validation.** The transcript is validated on both the client (instant UX feedback) and the server (security). Client-side validation can be bypassed by anyone calling the API directly, so the real check lives on the server. The client check is a UX nicety to save a network round-trip when the input is obviously wrong.

**Server components by default.** Only the form is a Client Component. The page shell ships as static HTML and only the interactive form sends JavaScript to the browser — smaller bundle, faster page.

**Input quality validation.** The transcript must contain at least two timestamps before the request even reaches Claude. The lesson is garbage in, garbage out — the AI's output is bounded by the quality of its input, so it's better to refuse confidently than to silently produce broken results.

**Scope discipline.** I deliberately did not build video transcription into v1. Transcription is a solved problem (Whisper, AssemblyAI), so I focused build time on the AI extraction layer where the interesting engineering decisions actually live. The same logic applies to features I left out — no user accounts, no saved clips, no video clipping, no analytics — all sensible v2 work, none of it adds engineering depth to v1.

## What I'd build next

- **Whisper-based transcription** so users can upload a video or audio file directly
- **Streaming responses** so clips appear progressively instead of all at once after 10 seconds
- **Input quality detection** — warn the user if the transcript is a tonal mismatch for the chosen style (e.g. asking for "funny" clips on a serious transcript)
- **Saved clips** with a lightweight database (Neon Postgres would fit the stack well)
- **Chunking long transcripts** that exceed Claude's context window

## Running locally

```bash
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
npm run dev
```

Then visit `http://localhost:3000`.

## Notes

- The example transcripts in `lib/example-transcripts.ts` are illustrative — realistic in shape, not real interviews
- The validation rule requires two timestamps minimum, calibrated stricter rather than looser because a single timestamp at the top of a paragraph isn't enough structure for the AI to suggest meaningful clip ranges
