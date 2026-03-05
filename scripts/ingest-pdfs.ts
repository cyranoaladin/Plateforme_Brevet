import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PDFExtractor } from '../src/services/ingestion/pdfExtractor';
import { chunkText } from '../src/services/ingestion/chunker';
import { VectorStoreService } from '../src/services/aria/vectorStore';
import { IngestionChunk } from '../src/services/ingestion/types';

// Mock/Stub pour les env vars si exécuté hors Next.js
process.env.ARIA_MODE = process.env.ARIA_MODE || 'mock';

async function main() {
  const args = process.argv.slice(2);
  const dir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'data/pdfs';
  const dryRun = args.includes('--dry-run');
  const chunkSize = parseInt(args.includes('--chunk-size') ? args[args.indexOf('--chunk-size') + 1] : '1000');
  const overlap = parseInt(args.includes('--overlap') ? args[args.indexOf('--overlap') + 1] : '200');

  console.log(`📂 Scanning directory: ${dir}`);
  
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
  console.log(`🔍 Found ${files.length} PDF files.`);

  const allProcessedChunks: IngestionChunk[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const docId = crypto.createHash('sha256').update(file).digest('hex').substring(0, 12);
    
    console.log(`📄 Processing: ${file} (ID: ${docId})`);

    try {
      const { pages } = await PDFExtractor.extract(filePath);
      
      pages.forEach((pageText, index) => {
        const pageNumber = index + 1;
        const chunks = chunkText(pageText, { chunkSize, overlap }, {
          docId,
          sourceFile: file,
          page: pageNumber,
          subject: 'general'
        });
        allProcessedChunks.push(...chunks);
      });

      console.log(`✅ Processed ${pages.length} pages, total ${allProcessedChunks.filter(c => c.metadata.docId === docId).length} chunks.`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err instanceof Error ? err.message : String(err));
    }
  }

  if (allProcessedChunks.length === 0) {
    console.warn("⚠️ No chunks extracted. Exiting.");
    return;
  }

  // Debug Output
  const outputDir = 'data/ingestion';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'output.json'), JSON.stringify(allProcessedChunks, null, 2));
  console.log(`💾 Debug output written to ${outputDir}/output.json`);

  // Vector Store Upsert
  if (process.env.ARIA_MODE === 'rag' && !dryRun) {
    console.log(`🚀 Upserting ${allProcessedChunks.length} chunks to Qdrant...`);
    try {
      await VectorStoreService.upsertChunks(allProcessedChunks.map(c => ({
        id: c.id,
        text: c.text,
        metadata: {
          ...c.metadata,
          year: 2026,
          docType: 'pdf_ingestion'
        }
      })));
      console.log("⭐ Upsert successful!");
    } catch (err) {
      console.error("❌ Qdrant Upsert Failed:", err);
      process.exit(1);
    }
  } else {
    console.log(`ℹ️ ARIA_MODE is '${process.env.ARIA_MODE}' or --dry-run active. Skipping Qdrant upsert.`);
  }
}

main().catch(err => {
  console.error("💥 Fatal Error:", err);
  process.exit(1);
});
