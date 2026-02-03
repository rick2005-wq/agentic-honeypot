# Local Git & GitHub Setup Guide

Follow these steps to push your code from your computer to GitHub and manage your local API keys.

## 1. Initialize Local Git Repository
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit: Agentic Honey-Pot System"
```

## 2. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Link your local folder and push:
```bash
git remote add origin https://github.com/rick2005-wq/agentic-honeypot.git
git branch -M main
git push -u origin main
```

## 3. Local API Key Management
The system automatically generates a default API key (`guvi-hackathon-2026-secret-key`) in your local database when it first runs.

### To Generate a Custom API Key Locally:
You can use the provided script to generate a new key for your local instance:

1. Create a file named `generate-key.ts` in your root folder:
```typescript
import { db } from "./server/db";
import { apiKey } from "./shared/schema";
import { randomBytes } from "crypto";

async function generate() {
  const newKey = "key_" + randomBytes(16).toString('hex');
  await db.insert(apiKey).values({
    key: newKey,
    description: "My Local Test Key"
  });
  console.log("New API Key Generated:", newKey);
  process.exit(0);
}
generate();
```
2. Run it using:
```bash
npx tsx generate-key.ts
```

## 4. Security Warning
**CRITICAL**: Do NOT commit your `.env` file to GitHub. It contains your database credentials and OpenAI keys. The project includes a `.gitignore` to prevent this, but always double-check.
