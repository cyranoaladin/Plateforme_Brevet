import { NextResponse } from "next/server";
import { AriaQueryRequestSchema } from "@/services/aria/types";
import { VectorStoreService } from "@/services/aria/vectorStore";
import { getLlmProvider } from "@/services/aria/llmProvider";
import { buildAriaRAGPrompt } from "@/services/aria/ariaPromptBuilder";
import { enforcePolicy, buildRefusal } from "@/services/aria/policy";
import { v4 as uuidv4 } from "uuid";
import { checkRateLimit } from "@/utils/security/rateLimit";
import { logger } from "@/utils/security/logger";
import { env } from "@/config/env";
import { RerankService } from "@/services/aria/rerank";
import { createHash } from "crypto";

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  // 1. Identification Anonymisée Immédiate (Privacy-by-Design)
  const forwarded = request.headers.get("x-forwarded-for");
  const rawIp = forwarded ? forwarded.split(',')[0] : "anonymous";
  
  // Hachage cryptographique de l'IP avant tout stockage ou log
  const clientHash = createHash('sha256')
    .update(rawIp + env.SALT)
    .digest('hex')
    .substring(0, 12);

  // Utilisation du hash comme clé de rate limit (évite de stocker l'IP en mémoire)
  const rateLimit = checkRateLimit(clientHash, 30, 5 * 60 * 1000); 

  if (!rateLimit.success) {
    logger.warn("Rate limit exceeded", { requestId, clientHash });
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaye dans quelques minutes." },
      { status: 429, headers: { "Retry-After": "300" } }
    );
  }

  try {
    const body = await request.json();
    const parsedRequest = AriaQueryRequestSchema.parse(body);
    
    // 2. Retrieval
    const { chunks: rawChunks, error: retrievalError } = await VectorStoreService.search(parsedRequest.query);
    const retrievalTime = Date.now() - startTime;

    if (retrievalError) {
      const userMessage = retrievalError === "BREAKER_OPEN" 
        ? "Le système de recherche est temporairement saturé. Réessaye dans 30 secondes."
        : "Le moteur de recherche des sources officielles est momentanément indisponible.";
      
      logger.error(`Retrieval Issue: ${retrievalError}`, { requestId });
      return NextResponse.json(buildRefusal(userMessage));
    }

    // 3. Reranking
    const chunks = await RerankService.rerank(parsedRequest.query, rawChunks);

    // 4. Generation
    const messages = buildAriaRAGPrompt(parsedRequest, chunks);
    const provider = getLlmProvider();
    const llmStart = Date.now();
    const llmResponse = await provider.generate(messages);
    const llmTime = Date.now() - llmStart;

    // 5. Policy
    const finalResponse = enforcePolicy(llmResponse.text, chunks, parsedRequest.query);

    // 6. Secure Logging (RGPD Compliant)
    logger.info("Aria Query Success", { 
      requestId, 
      clientHash,
      retrievalTime, 
      llmTime, 
      confidence: finalResponse.confidence,
      coverage: finalResponse.coverage,
      subject: parsedRequest.context.subject
    });

    return NextResponse.json(finalResponse);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("API Error", { requestId, message });
    return NextResponse.json({ error: "Service Temporarily Unavailable" }, { status: 503 });
  }
}
