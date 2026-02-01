import { db } from "./db";
import {
  conversations,
  messages,
  intelligence,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Intelligence,
  type InsertIntelligence,
  type DashboardStats
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Conversations
  getConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;

  // Messages
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Intelligence
  getIntelligence(conversationId: number): Promise<Intelligence[]>;
  createIntelligence(intel: InsertIntelligence): Promise<Intelligence>;
  getAllIntelligence(): Promise<Intelligence[]>;

  // Stats
  getStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async getConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations).orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(insertConversation).returning();
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation> {
    const [updated] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return updated;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getIntelligence(conversationId: number): Promise<Intelligence[]> {
    return await db
      .select()
      .from(intelligence)
      .where(eq(intelligence.conversationId, conversationId));
  }

  async createIntelligence(insertIntel: InsertIntelligence): Promise<Intelligence> {
    const [intel] = await db.insert(intelligence).values(insertIntel).returning();
    return intel;
  }

  async getAllIntelligence(): Promise<Intelligence[]> {
    return await db.select().from(intelligence).orderBy(desc(intelligence.createdAt));
  }

  async getStats(): Promise<DashboardStats> {
    const totalConversationsResult = await db.select({ count: sql<number>`count(*)` }).from(conversations);
    const activeHoneypotsResult = await db.select({ count: sql<number>`count(*)` }).from(conversations).where(eq(conversations.status, 'active'));
    const scamsDetectedResult = await db.select({ count: sql<number>`count(*)` }).from(conversations).where(eq(conversations.scamDetected, true));
    const intelligenceCountResult = await db.select({ count: sql<number>`count(*)` }).from(intelligence);
    
    // Simple aggregation for top scam types
    const topScamTypesResult = await db
      .select({ type: conversations.scamType, count: sql<number>`count(*)` })
      .from(conversations)
      .where(sql`${conversations.scamType} IS NOT NULL`)
      .groupBy(conversations.scamType)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    return {
      totalConversations: Number(totalConversationsResult[0]?.count || 0),
      activeHoneypots: Number(activeHoneypotsResult[0]?.count || 0),
      scamsDetected: Number(scamsDetectedResult[0]?.count || 0),
      intelligenceCount: Number(intelligenceCountResult[0]?.count || 0),
      topScamTypes: topScamTypesResult.map(r => ({ type: r.type || "Unknown", count: Number(r.count) })),
    };
  }
}

export const storage = new DatabaseStorage();
