"use client";

import { useState } from "react";

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

  const isDisabled =
    transcript.trim() === "" ||
    (clipType === "custom" && customPrompt.trim() === "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ transcript, clipType, customPrompt });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="transcript" className="text-sm font-medium text-gray-700">
          Transcript
        </label>
        <textarea
          id="transcript"
          rows={8}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
          placeholder="Paste a transcript with timestamps, e.g. [00:00:14] Speaker: ..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">What kind of clips?</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setClipType(value)}
              className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                clipType === value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {clipType === "custom" && (
          <input
            type="text"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
            placeholder="Describe the kind of clips you want, e.g. find clips about love"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="self-start rounded border border-gray-900 bg-gray-900 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Find clips
      </button>
    </form>
  );
}
