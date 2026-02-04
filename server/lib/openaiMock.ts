export async function mockOpenAIResponse(message: string, historyText: string) {
    let scamDetected = false;
    let scamScore = 0;
    let scamType: string | null = null;
    let reply = "Hmm, okay!";
  
    let extracted = {
      upi_ids: [] as string[],
      bank_accounts: [] as string[],
      urls: [] as string[],
      phones: [] as string[],
      wallets: [] as string[], // added for crypto scams
    };
  
    if (message.toLowerCase().includes("wallet") || message.includes("$")) {
      scamDetected = true;
      scamScore = 90;
      scamType = "Crypto";
      reply = "Wow, that sounds interesting, can you explain more?";
      extracted.wallets = ["0x123abc..."];
    } else if (message.toLowerCase().includes("whatsapp") || message.match(/\+\d{10,}/)) {
      scamDetected = true;
      scamScore = 85;
      scamType = "Job";
      reply = "I am interested! What do I need to do?";
      extracted.phones = ["+1234567890"];
    }
  
    return {
      scam_detected: scamDetected,
      scam_score: scamScore,
      scam_type: scamType,
      reply,
      extracted,
    };
  }
  