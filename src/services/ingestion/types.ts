export interface IngestionChunk {
  id: string; // docId:page:index
  text: string;
  metadata: {
    docId: string;
    sourceFile: string;
    page: number;
    chunkIndex: number;
    subject?: string;
  };
}

export interface IngestionConfig {
  chunkSize: number;
  overlap: number;
}
