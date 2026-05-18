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
    <div className="rounded border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-500">
          {clip.startTime} – {clip.endTime}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5 hover:border-gray-500 hover:text-gray-800"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="text-base font-semibold text-gray-900">{clip.title}</p>

      <p className="text-sm italic text-gray-600 border-l-2 border-gray-200 pl-3">
        "{clip.transcriptExcerpt}"
      </p>

      <p className="text-xs text-gray-500">{clip.whyItWorks}</p>

      <div className="rounded bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600">
        {clip.suggestedCaption}
      </div>
    </div>
  );
}
