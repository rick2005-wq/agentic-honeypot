# Agentic Honey-Pot for Scam Detection & Intelligence Extraction

## Overview

This is a cybersecurity application that detects scam intent, engages scammers via an autonomous AI-powered honeypot agent, and extracts structured intelligence (UPI IDs, bank account details, phone numbers, phishing URLs). The system features a cyberpunk-themed terminal UI for monitoring active operations, viewing extracted intelligence, and testing the honeypot AI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state and caching
- **Styling**: Tailwind CSS with custom cyberpunk/terminal theme extending shadcn/ui components
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling conventions
- **Charts**: Recharts for data visualization (threat metrics, scam statistics)
- **Animations**: Framer Motion for terminal effects and page transitions

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **AI Integration**: OpenAI API (via Replit AI Integrations) for scam detection and honeypot responses
- **Authentication**: API key-based authentication for the `/api/check-scam` endpoint

### Data Storage
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Key Tables**:
  - `conversations`: Tracks honeypot sessions with scam scores and types
  - `messages`: Stores conversation messages with role (scammer/agent/system) and metadata
  - `intelligence`: Extracted threat data (UPI IDs, bank accounts, phones, URLs)
  - `api_key`: API keys for endpoint authentication

### Build System
- **Development**: tsx for TypeScript execution, Vite dev server with HMR
- **Production**: esbuild bundles server code, Vite builds client to `dist/public`
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared folder

### Key Design Patterns
- **Shared Types**: Schema definitions and route contracts in `shared/` folder used by both client and server
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Replit Integrations**: Pre-built modules in `server/replit_integrations/` for audio, chat, image, and batch processing

## External Dependencies

### AI Services
- **OpenAI API**: Used via Replit AI Integrations for GPT-based scam detection and honeypot agent responses
- **Environment Variables**: `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Database
- **PostgreSQL**: Neon serverless Postgres, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Schema migrations stored in `migrations/` folder, push with `npm run db:push`

### Frontend Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives (dialogs, dropdowns, tooltips, etc.)
- **Recharts**: Chart library for dashboard visualizations
- **date-fns**: Date formatting utilities
- **Framer Motion**: Animation library for UI effects

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner for enhanced Replit development experience