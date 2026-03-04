import { AriaQueryRequest, AriaResponse } from "./types";

export class AriaClient {
  static async query(request: AriaQueryRequest): Promise<AriaResponse> {
    const response = await fetch("/api/mentor/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Aria API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async explainMistake(request: AriaQueryRequest): Promise<AriaResponse> {
    const response = await fetch("/api/mentor/explain-mistake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Aria API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
