import { z } from "zod";
import { validateTranscript } from "@/lib/validate-transcript";

const RequestSchema = z.object({
  transcript: z.string(),
  clipType: z.enum(["funny", "inspirational", "educational", "viral", "custom"]),
  customPrompt: z.string().optional(),
});

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

  // TODO: call Claude API here
  void clipType;
  void customPrompt;
  return Response.json({ clips: [] });
}
