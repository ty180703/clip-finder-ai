const TIMESTAMP_RE = /(\d{1,2}:)?\d{1,2}:\d{2}/g;

export function validateTranscript(transcript: string): { ok: true } | { ok: false; error: string } {
  if (transcript.trim().length < 200) {
    return {
      ok: false,
      error: "Transcript is too short. Please paste a transcript of at least a paragraph or two.",
    };
  }

  const matches = transcript.match(TIMESTAMP_RE);
  if (!matches || matches.length < 2) {
    return {
      ok: false,
      error: "No timestamps detected. The transcript needs timestamps (e.g. [00:00:14]) so the tool can suggest clip ranges.",
    };
  }

  return { ok: true };
}
