import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { db } from "./db";
import { apiKey } from "@shared/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- API Key Middleware ---
  app.use(async (req, res, next) => {
    // Only protect the /api/check-scam endpoint for the hackathon reviewer
    if (req.path === api.scam.check.path) {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "API Key required" });
      }
      const key = authHeader.split(' ')[1];
      const keys = await db.select().from(apiKey).where(eq(apiKey.key, key));
      if (keys.length === 0) {
        return res.status(401).json({ message: "Invalid API Key" });
      }
    }
    next();
  });

  // --- Mock Scammer Interaction Endpoint ---
  app.post(api.scam.check.path, async (req, res) => {
    try {
      const { message, conversation_id } = req.body;
      const externalId = conversation_id || `new-${Date.now()}`;

      // 1. Find or create conversation based on external ID (mapping logic simplified here)
      // In a real app, we'd map external conversation_id to internal ID.
      // For now, let's look up by a hacky title match or create new.
      let conversations = await storage.getConversations();
      let conversation = conversations.find(c => c.title === `External: ${externalId}`);
      
      if (!conversation) {
        conversation = await storage.createConversation({
          title: `External: ${externalId}`,
          status: "active",
          scamScore: 0,
          scamDetected: false,
        });
      }

      // 2. Log incoming message
      await storage.createMessage({
        conversationId: conversation.id,
        role: "scammer",
        content: message,
      });

      // 3. AI Analysis & Response Generation
      // We'll do a two-step process or a single smart prompt.
      // Let's use a single prompt for speed and agentic behavior.

      const history = await storage.getMessages(conversation.id);
      const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

      const systemPrompt = `
        You are an AI Scambaiter Agent. Your goal is to detect scams, engage scammers, and extract intelligence.
        
        Analyze the incoming message and the conversation history.
        
        1. **Detection**: Is this a scam? (0-100 score). What type? (UPI, Bank, Job, Romance, etc.)
        2. **Action**: If it's a scam, engage the scammer. Pretend to be a naive, confused, but cooperative victim.
           - Ask clarifying questions.
           - Delay payments with realistic excuses (tech issues, busy).
           - Try to get them to send UPI IDs, Bank Details, or Links.
           If it's NOT a scam, reply neutrally.
        3. **Extraction**: Identify any phone numbers, UPI IDs, URLs, or bank details in the message.

        Respond in JSON format:
        {
          "scam_detected": boolean,
          "scam_score": number (0-100),
          "scam_type": stringOrNull,
          "reply": string (your response to the scammer),
          "extracted": {
            "upi_ids": [], "bank_accounts": [], "urls": [], "phones": []
          }
        }
      `;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `New Message: "${message}"\n\nHistory:\n${historyText}` }
        ],
        response_format: { type: "json_object" },
      });

      const aiResult = JSON.parse(aiResponse.choices[0].message.content || "{}");

      // 4. Update Conversation State
      if (aiResult.scam_detected) {
        await storage.updateConversation(conversation.id, {
          scamDetected: true,
          scamScore: aiResult.scam_score,
          scamType: aiResult.scam_type,
        });
      }

      // 5. Save Intelligence
      if (aiResult.extracted) {
        const types = ["upi_ids", "bank_accounts", "urls", "phones"];
        for (const typeKey of types) {
          const items = aiResult.extracted[typeKey];
          if (Array.isArray(items)) {
            for (const item of items) {
              // Map key to DB type enum roughly
              const dbType = typeKey.replace("_ids", "").replace("_accounts", "").replace("s", ""); // simplistic mapping
              await storage.createIntelligence({
                conversationId: conversation.id,
                type: dbType,
                value: item,
                confidence: 90, // AI is confident enough
              });
            }
          }
        }
      }

      // 6. Save Agent Reply
      if (aiResult.reply) {
        await storage.createMessage({
          conversationId: conversation.id,
          role: "agent",
          content: aiResult.reply,
          metadata: { confidence: aiResult.scam_score }
        });
      }

      // 7. Construct Response
      const responseData = {
        scam_detected: aiResult.scam_detected || false,
        confidence: (aiResult.scam_score || 0) / 100,
        agent_mode: aiResult.scam_detected ? "honeypot_active" : "neutral",
        reply: aiResult.reply || "...",
        metrics: {
          turn_count: history.length + 2,
          engagement_time_sec: Math.floor((Date.now() - new Date(conversation.createdAt!).getTime()) / 1000),
        },
        extracted_intelligence: aiResult.extracted || { bank_accounts: [], upi_ids: [], phishing_urls: [], phone_numbers: [] }
      };

      res.json(responseData);

    } catch (err) {
      console.error("Error in check-scam:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // --- Dashboard Routes ---
  
  app.get(api.conversations.list.path, async (req, res) => {
    const conversations = await storage.getConversations();
    res.json(conversations);
  });

  app.get(api.conversations.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const conversation = await storage.getConversation(id);
    if (!conversation) return res.status(404).json({ message: "Not found" });
    
    const messages = await storage.getMessages(id);
    const intel = await storage.getIntelligence(id);
    
    res.json({ conversation, messages, intelligence: intel });
  });

  app.delete(api.conversations.delete.path, async (req, res) => {
    await storage.deleteConversation(Number(req.params.id));
    res.status(204).end();
  });

  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Seed data on startup
  await seedDatabase();

  return httpServer;
}

// Seed function
export async function seedDatabase() {
  const existingKeys = await db.select().from(apiKey);
  if (existingKeys.length === 0) {
    await db.insert(apiKey).values({
      key: "guvi-hackathon-2026-secret-key",
      description: "HCL Hackathon Reviewer Key"
    });
  }

  const conversations = await storage.getConversations();
  if (conversations.length === 0) {
    // 1. Crypto Scam
    const c1 = await storage.createConversation({
      title: "External: user-123-crypto",
      scamScore: 95,
      scamDetected: true,
      scamType: "Crypto",
      status: "active"
    });
    await storage.createMessage({ conversationId: c1.id, role: "scammer", content: "Hello friend, do you want to earn 500% returns in 24 hours? Invest in BitScam now!" });
    await storage.createMessage({ conversationId: c1.id, role: "agent", content: "Wow, 500%? That sounds amazing but also a bit scary. Is it safe?" });
    await storage.createMessage({ conversationId: c1.id, role: "scammer", content: "100% safe. Send $1000 to this wallet: 0x123abc..." });
    await storage.createIntelligence({ conversationId: c1.id, type: "wallet", value: "0x123abc...", confidence: 100 });

    // 2. Job Scam
    const c2 = await storage.createConversation({
      title: "External: user-456-job",
      scamScore: 88,
      scamDetected: true,
      scamType: "Job",
      status: "active"
    });
    await storage.createMessage({ conversationId: c2.id, role: "scammer", content: "We are hiring part-time optimization managers. Pay is $500/day. WhatsApp me at +1234567890" });
    await storage.createMessage({ conversationId: c2.id, role: "agent", content: "I am looking for a job! What do I need to do?" });
    await storage.createIntelligence({ conversationId: c2.id, type: "phone", value: "+1234567890", confidence: 95 });

    // 3. Normal Message
    const c3 = await storage.createConversation({
      title: "External: user-789-normal",
      scamScore: 5,
      scamDetected: false,
      status: "active"
    });
    await storage.createMessage({ conversationId: c3.id, role: "scammer", content: "Hey mom, just checking in." });
    await storage.createMessage({ conversationId: c3.id, role: "agent", content: "I think you have the wrong number." });
  }
}
