/**
 * Script de vérification du pipeline RAG.
 * Teste l'endpoint Mentor Query et valide la présence de citations.
 */
const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}/api/mentor/query`;

console.log(`🔍 Verifying RAG pipeline on ${URL}...`);

async function verify() {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: "Qu'est-ce que le théorème de Thalès ?",
        context: { subject: "maths" },
        studentProfile: {
          rank: "Apprenti",
          mastery: 50,
          bloomLevel: "N2"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("------------------------------------------");
    console.log("🤖 Mentor Answer Preview:");
    console.log(data.answerMarkdown.substring(0, 150) + "...");
    console.log("------------------------------------------");
    
    if (data.citations && data.citations.length > 0) {
      console.log(`✅ Success! Found ${data.citations.length} valid citations.`);
      data.citations.forEach((c, i) => {
        console.log(`   [${i+1}] Source: ${c.source}, Page: ${c.pageNumber || 'N/A'}`);
      });
    } else {
      console.warn("⚠️ Warning: No citations found. Check if Qdrant contains chunks.");
    }

  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    process.exit(1);
  }
}

verify();
