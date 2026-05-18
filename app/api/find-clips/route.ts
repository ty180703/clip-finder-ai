import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { validateTranscript } from "@/lib/validate-transcript";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RequestSchema = z.object({
  transcript: z.string(),
  clipType: z.enum(["funny", "inspirational", "educational", "viral", "custom"]),
  customPrompt: z.string().optional(),
});

const ClipSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  transcriptExcerpt: z.string(),
  whyItWorks: z.string(),
  suggestedCaption: z.string(),
});

const ResponseSchema = z.object({ clips: z.array(ClipSchema) });

const STYLE_BRIEFS: Record<string, string> = {
  funny: "Find the funniest moments — quick punchlines, witty exchanges, unexpected humour.",
  inspirational: "Find inspirational moments — quotable insights, motivating realisations, advice that lands.",
  educational: "Find educational moments — concrete lessons, frameworks, surprising facts.",
  viral: "Find moments with viral hook potential — controversial takes, big contrasts, surprising statements that make a viewer stop scrolling.",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { transcript, clipType, customPrompt } = parsed.data;

  const validation = validateTranscript(transcript);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const styleBrief =
    clipType === "custom"
      ? customPrompt ?? ""
      : STYLE_BRIEFS[clipType];

  const userMessage = `Style brief: ${styleBrief}\n\nTranscript:\n${transcript}`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system:
        "You are a short-form content strategist who analyses long-form video transcripts and identifies clip candidates suitable for TikTok, Instagram Reels, or YouTube Shorts. Each clip should be between roughly 15 and 60 seconds long, make sense as a standalone moment without surrounding context, and have a clear hook. Find 3 to 6 clips per transcript. Timestamps must be copied directly from the transcript — do not invent or interpolate times. If the transcript is short or weak, return fewer clips rather than padding.",
      tools: [
        {
          name: "submit_clip_suggestions",
          description: "Submit the list of short-form clip suggestions extracted from the transcript.",
          input_schema: {
            type: "object" as const,
            properties: {
              clips: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    startTime: {
                      type: "string",
                      description: "Start timestamp in HH:MM:SS or MM:SS format, copied exactly from the transcript.",
                    },
                    endTime: {
                      type: "string",
                      description: "End timestamp in HH:MM:SS or MM:SS format.",
                    },
                    title: {
                      type: "string",
                      description: "Short catchy hook for the clip, max 80 characters.",
                    },
                    transcriptExcerpt: {
                      type: "string",
                      description: "The quoted text from the transcript, lightly trimmed.",
                    },
                    whyItWorks: {
                      type: "string",
                      description: "One sentence explaining why this clip fits the requested style.",
                    },
                    suggestedCaption: {
                      type: "string",
                      description: "A short social caption with 2-3 hashtags.",
                    },
                  },
                  required: [
                    "startTime",
                    "endTime",
                    "title",
                    "transcriptExcerpt",
                    "whyItWorks",
                    "suggestedCaption",
                  ],
                },
              },
            },
            required: ["clips"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "submit_clip_suggestions" },
      messages: [{ role: "user", content: userMessage }],
    });

    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock =>
        block.type === "tool_use" && block.name === "submit_clip_suggestions"
    );

    if (!toolUseBlock) {
      return Response.json({ error: "Model returned malformed output" }, { status: 500 });
    }

    const validated = ResponseSchema.safeParse(toolUseBlock.input);
    if (!validated.success) {
      return Response.json({ error: "Model returned malformed output" }, { status: 500 });
    }

    return Response.json({ clips: validated.data.clips });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Claude API error:", error);
    return Response.json(
      { error: "Failed to generate clips", message },
      { status: 500 }
    );
  }
}
