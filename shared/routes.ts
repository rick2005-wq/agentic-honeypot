import { z } from 'zod';
import { insertConversationSchema, insertMessageSchema, conversations, messages, intelligence } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scam: {
    check: {
      method: 'POST' as const,
      path: '/api/check-scam',
      input: z.object({
        conversation_id: z.string().optional(),
        message: z.string(),
      }),
      responses: {
        200: z.object({
          scam_detected: z.boolean(),
          confidence: z.number(),
          agent_mode: z.string(),
          reply: z.string(),
          metrics: z.object({
            turn_count: z.number(),
            engagement_time_sec: z.number(),
          }).optional(),
          extracted_intelligence: z.object({
            bank_accounts: z.array(z.string()),
            upi_ids: z.array(z.string()),
            phishing_urls: z.array(z.string()),
            phone_numbers: z.array(z.string()),
          }).optional(),
        }),
      },
    },
  },
  conversations: {
    list: {
      method: 'GET' as const,
      path: '/api/conversations',
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/conversations/:id',
      responses: {
        200: z.object({
          conversation: z.custom<typeof conversations.$inferSelect>(),
          messages: z.array(z.custom<typeof messages.$inferSelect>()),
          intelligence: z.array(z.custom<typeof intelligence.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/conversations/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          totalConversations: z.number(),
          activeHoneypots: z.number(),
          scamsDetected: z.number(),
          intelligenceCount: z.number(),
          topScamTypes: z.array(z.object({
            type: z.string(),
            count: z.number(),
          })),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
