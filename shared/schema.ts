import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("New Conversation"),
  scamScore: integer("scam_score").default(0),
  scamDetected: boolean("scam_detected").default(false),
  scamType: text("scam_type"), // e.g. "UPI", "Bank", "Job", "Romance"
  status: text("status").notNull().default("active"), // "active", "completed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // "scammer" (incoming), "agent" (outgoing/internal), "system"
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Store confidence scores, analysis results
  createdAt: timestamp("created_at").defaultNow(),
});

export const intelligence = pgTable("intelligence", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  type: text("type").notNull(), // "upi", "bank_account", "phone", "url", "email"
  value: text("value").notNull(),
  confidence: integer("confidence").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertIntelligenceSchema = createInsertSchema(intelligence).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Intelligence = typeof intelligence.$inferSelect;
export type InsertIntelligence = z.infer<typeof insertIntelligenceSchema>;

// Request types
export type CreateConversationRequest = { title?: string };
export type CheckScamRequest = {
  conversation_id?: string; // External ID from mock scammer
  message: string;
};

// Response types
export type ScamCheckResponse = {
  scam_detected: boolean;
  confidence: number;
  agent_mode: string;
  reply: string;
  metrics?: {
    turn_count: number;
    engagement_time_sec: number;
  };
  extracted_intelligence?: {
    bank_accounts: string[];
    upi_ids: string[];
    phishing_urls: string[];
    phone_numbers: string[];
  };
};

export type DashboardStats = {
  totalConversations: number;
  activeHoneypots: number;
  scamsDetected: number;
  intelligenceCount: number;
  topScamTypes: { type: string; count: number }[];
};
