import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PDFExtractor } from '../src/services/ingestion/pdfExtractor';
import { chunkText } from '../src/services/ingestion/chunker';
import { VectorStoreService } from '../src/services/aria/vectorStore';
import { IngestionChunk } from '../src/services/ingestion/types';

// Defaults
const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 200;
const DEFAULT_DIR = 'data/pdfs';

function showHelp() {
  console.log(`
🚀 ARIA PDF Ingestor CLI
Usage: npm run ingest:pdf -- [options]

Options:
  --dir <path>        Directory to scan for PDFs (default: ${DEFAULT_DIR})
  --chunk-size <num>  Characters per chunk (default: ${DEFAULT_CHUNK_SIZE})
  --overlap <num>     Characters overlap between chunks (default: ${DEFAULT_OVERLAP})
  --dry-run           Perform extraction and local saving without Qdrant upsert
  --help              Show this help message
  `);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    showHelp();
    return;
  }

  const dir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : DEFAULT_DIR;
  const dryRun = args.includes('--dry-run');
  const chunkSize = parseInt(args.includes('--chunk-size') ? args[args.indexOf('--chunk-size') + 1] : DEFAULT_CHUNK_SIZE.toString());
  const overlap = parseInt(args.includes('--overlap') ? args[args.indexOf('--overlap') + 1] : DEFAULT_OVERLAP.toString());

  // Validations
  if (isNaN(chunkSize) || chunkSize <= 0) {
    console.error("❌ Error: --chunk-size must be a positive number.");
    process.exit(1);
  }
  if (isNaN(overlap) || overlap < 0 || overlap >= chunkSize) {
    console.error("❌ Error: --overlap must be >= 0 and < chunk-size.");
    process.exit(1);
  }

  console.log(`📂 Scanning: ${path.resolve(dir)}`);
  
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
  console.log(`🔍 Found ${files.length} PDF files.`);

  const allProcessedChunks: IngestionChunk[] = [];
  let hasFailures = false;

  for (const file of files) {
    const filePath = path.join(dir, file);
    
    try {
      // Deterministic DocId from file content
      const buffer = fs.readFileSync(filePath);
      const docId = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
      
      console.log(`📄 Processing: ${file} (Content ID: ${docId})`);

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

      console.log(`   ✅ Extracted ${pages.length} pages, ${allProcessedChunks.filter(c => c.metadata.docId === docId).length} total chunks.`);
    } catch (err) {
      console.error(`   ❌ FAILED to process ${file}:`, err instanceof Error ? err.message : String(err));
      hasFailures = true;
    }
  }

  if (allProcessedChunks.length === 0) {
    console.warn("⚠️ No chunks extracted.");
    if (hasFailures) process.exit(1);
    return;
  }

  // Save local debug JSON
  const outputDir = 'data/ingestion';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'output.json');
  fs.writeFileSync(outputPath, JSON.stringify(allProcessedChunks, null, 2));
  console.log(`💾 Local backup saved to ${outputPath}`);

  // Vector Store Upsert
  const isRagEnabled = process.env.ARIA_MODE === 'rag';
  
  if (isRagEnabled && !dryRun) {
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
      console.error("❌ Qdrant Upsert FAILED:", err);
      process.exit(1);
    }
  } else {
    const reason = dryRun ? "--dry-run active" : `ARIA_MODE is '${process.env.ARIA_MODE}'`;
    console.log(`ℹ️ skipping Qdrant upsert (${reason}).`);
  }

  if (hasFailures) {
    console.warn("\n⚠️ Some files failed during the process. Check the logs above.");
    process.exit(1);
  }
}

main().catch(err => {
  console.error("💥 Fatal Error:", err);
  process.exit(1);
});
