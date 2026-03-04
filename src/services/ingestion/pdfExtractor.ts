import fs from 'fs';
// @ts-expect-error: pdf-parse has no official types for ESM default import
import pdf from 'pdf-parse';

export interface PDFData {
  text: string;
  pageCount: number;
}

export class PDFExtractor {
  /**
   * Extrait le texte brut d'un fichier PDF.
   */
  static async extract(filePath: string): Promise<PDFData> {
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
      const data = await pdf(dataBuffer);
      return {
        text: data.text || "",
        pageCount: data.numpages || 0
      };
    } catch (err) {
      throw new Error(`Failed to parse PDF ${filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
