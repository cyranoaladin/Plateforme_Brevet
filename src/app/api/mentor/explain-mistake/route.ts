import { NextResponse } from "next/server";
import { AriaQueryRequestSchema } from "@/services/aria/types";
import { getAriaMockResponse } from "@/services/aria/ariaMock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedRequest = AriaQueryRequestSchema.parse(body);
    
    // Simulation délai IA
    await new Promise(r => setTimeout(r, 1500));
    
    const mockResponse = getAriaMockResponse(`Explique mon erreur sur ${parsedRequest.context.notionId}`);
    
    return NextResponse.json(mockResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Invalid Request", details: message }, { status: 400 });
  }
}
