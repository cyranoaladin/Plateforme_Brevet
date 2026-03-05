import fs from 'fs';
import pdf from 'pdf-parse';

export interface PDFData {
  pages: string[];
  pageCount: number;
  fullText: string;
}

interface PageData {
  getTextContent: (options?: { normalizeWhitespace: boolean; disableCombineTextItems: boolean }) => Promise<{
    items: Array<{ str: string; transform: number[] }>;
  }>;
}

export class PDFExtractor {
  /**
   * Extrait le texte d'un PDF en préservant la structure par page.
   */
  static async extract(filePath: string): Promise<PDFData> {
    const dataBuffer = fs.readFileSync(filePath);
    const pages: string[] = [];

    // Hook de rendu pour capturer le texte page par page
    const pagerender = async (pageData: PageData): Promise<string> => {
      const options = { normalizeWhitespace: true, disableCombineTextItems: false };
      const textContent = await pageData.getTextContent(options);
      
      let lastY, text = '';
      for (const item of textContent.items) {
        if (lastY === item.transform[5] || !lastY) {
          text += item.str;
        } else {
          text += '\n' + item.str;
        }    
        lastY = item.transform[5];
      }
      
      pages.push(text);
      return text;
    };

    try {
      const data = await pdf(dataBuffer, { pagerender });
      
      return {
        pages: pages.length > 0 ? pages : [data.text || ""],
        pageCount: data.numpages || pages.length || 0,
        fullText: data.text || ""
      };
    } catch (err) {
      throw new Error(`Failed to parse PDF ${filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
