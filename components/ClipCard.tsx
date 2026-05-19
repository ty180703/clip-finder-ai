"use client";

import { useState } from "react";

export interface Clip {
  startTime: string;
  endTime: string;
  title: string;
  transcriptExcerpt: string;
  whyItWorks: string;
  suggestedCaption: string;
}

export default function ClipCard({ clip }: { clip: Clip }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(clip.suggestedCaption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mb-4 rounded-lg border border-slate-200 border-l-4 border-l-accent-500 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
          {clip.startTime} – {clip.endTime}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded border px-2 py-1 text-xs transition-colors ${
            copied
              ? "border-accent-500 bg-accent-500 text-white"
              : "border-slate-300 text-slate-700 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 text-lg font-semibold text-accent-800">{clip.title}</p>

      <p className="my-3 border-l-4 border-accent-200 pl-4 text-sm italic text-slate-700">
        "{clip.transcriptExcerpt}"
      </p>

      <p className="mt-2 text-sm text-slate-600">{clip.whyItWorks}</p>

      <div className="mt-3 rounded border border-accent-100 bg-accent-50 p-3 text-sm text-accent-900">
        {clip.suggestedCaption}
      </div>
    </div>
  );
}
