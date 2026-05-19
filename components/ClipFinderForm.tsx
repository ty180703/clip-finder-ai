"use client";

import { useState } from "react";
import { EXAMPLE_TRANSCRIPTS } from "@/lib/example-transcripts";
import { validateTranscript } from "@/lib/validate-transcript";
import ClipCard, { type Clip } from "@/components/ClipCard";

type ClipType = "funny" | "inspirational" | "educational" | "viral" | "custom";

const PRESETS: { label: string; value: ClipType }[] = [
  { label: "Funny", value: "funny" },
  { label: "Inspirational", value: "inspirational" },
  { label: "Educational", value: "educational" },
  { label: "Viral hooks", value: "viral" },
  { label: "Custom", value: "custom" },
];

export default function ClipFinderForm() {
  const [transcript, setTranscript] = useState("");
  const [clipType, setClipType] = useState<ClipType>("funny");
  const [customPrompt, setCustomPrompt] = useState("");
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const isDisabled =
    isLoading ||
    transcript.trim() === "" ||
    (clipType === "custom" && customPrompt.trim() === "");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = validateTranscript(transcript);
    if (!result.ok) {
      setTranscriptError(result.error);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setClips([]);

    try {
      const res = await fetch("/api/find-clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, clipType, customPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setClips(data.clips);
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <label htmlFor="transcript" className="text-sm font-medium text-slate-700">
              Transcript
            </label>
            <span className="text-xs text-slate-500">Try an example:</span>
            {EXAMPLE_TRANSCRIPTS.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setTranscript(ex.transcript)}
                className="text-xs text-slate-500 hover:underline"
              >
                {ex.label}
              </button>
            ))}
          </div>
          <textarea
            id="transcript"
            rows={8}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
            placeholder="Paste a transcript with timestamps, e.g. [00:00:14] Speaker: ..."
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setTranscriptError(null);
            }}
          />
          {transcriptError && (
            <p className="text-xs text-red-600">{transcriptError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">What kind of clips?</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setClipType(value)}
                className={`rounded border px-3 py-1 text-sm font-medium transition-colors ${
                  clipType === value
                    ? "border-accent-500 bg-accent-500 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-accent-300 hover:text-accent-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {clipType === "custom" && (
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="Describe the kind of clips you want, e.g. find clips about love"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-md bg-accent-500 px-5 py-2 text-sm font-medium text-white hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isLoading ? "Finding clips..." : "Find clips"}
        </button>
      </form>

      {apiError && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {clips.length > 0 && (
        <div className="flex flex-col gap-4">
          {clips.map((clip, i) => (
            <ClipCard key={i} clip={clip} />
          ))}
        </div>
      )}
    </div>
  );
}
