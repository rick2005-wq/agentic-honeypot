# Agentic Honey-Pot for Scam Detection & Intelligence Extraction

## Overview
This system detects scam intent, engages scammers via an autonomous honeypot agent, and extracts structured intelligence (UPI IDs, bank details, URLs).

## GitHub Deployment
To push this code to GitHub:
1. Open the **Git** pane in Replit (left sidebar).
2. Click **Create a Git Repo**.
3. Connect your GitHub account and create a new repository.
4. Push your changes.

## API Key for Reviewers
The system uses API Key authentication for the `/api/check-scam` endpoint as required by the PRD.

**Reviewer API Key:** `guvi-hackathon-2026-secret-key`

### How to use:
Include the following header in your requests to the Mock Scammer API endpoint:
`Authorization: Bearer guvi-hackathon-2026-secret-key`

### Endpoint:
`POST https://[your-repl-name].[your-username].replit.app/api/check-scam`

**Request Body:**
```json
{
  "conversation_id": "abc123",
  "message": "You have won lottery click link"
}
```

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn UI, Recharts.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL (Neon), Drizzle ORM.
- **AI:** OpenAI GPT-5 (via Replit AI Integrations).
