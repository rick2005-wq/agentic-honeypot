# Local Deployment Guide (VS Code)

To run this Agentic Honey-Pot locally in VS Code without Replit's specific database and environment:

## 1. Prerequisites
- **Node.js 20+**
- **PostgreSQL** (Installed locally or using a service like Neon.tech/Supabase)
- **OpenAI API Key** (You will need your own key for local use)

## 2. Setup
1. **Clone/Download** your code to a local folder.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/honeypot_db
   OPENAI_API_KEY=your_openai_api_key_here
   AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key_here
   AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
   ```

## 3. Database Migration
Push the schema to your local database:
```bash
npm run db:push
```

## 4. Run the Application
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5000`.

## 5. Mock Scammer API Integration
For the hackathon review, your local URL will likely be internal. To provide a public URL:
- Use **ngrok** to tunnel your local port 5000 to a public URL: `ngrok http 5000`
- Use the generated ngrok URL as your base for the `/api/check-scam` endpoint.

**API Key for Reviewers**: 
The key remains `guvi-hackathon-2026-secret-key` (it is automatically seeded in `server/routes.ts`).
