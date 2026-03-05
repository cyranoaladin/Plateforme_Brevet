/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'pdf-parse' {
  interface PDFParseOptions {
    pagerender?: (pageData: any) => Promise<string> | string;
    max?: number;
    version?: string;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: unknown;
    metadata: unknown;
    text: string;
    version: string;
  }

  function pdf(dataBuffer: Buffer, options?: PDFParseOptions): Promise<PDFParseResult>;

  export default pdf;
}
