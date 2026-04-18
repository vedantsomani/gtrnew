// File: scripts/check-secrets.js
// Purpose: Prevent accidental API key commits

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Patterns for API keys that should NEVER be in code
const secretPatterns = {
  gemini: /AIza[0-9A-Za-z-_]{35}/,
  anthropic: /sk-ant-[A-Za-z0-9]{48}/,
  openai: /sk-[a-zA-Z0-9]{48}/,
};

// Files to check
const filesToCheck = [
  'src/components/Chatbot.jsx',
  'src/App.jsx',
  'api/chat.js',
  'src/utils/securityLogger.js',
  'package.json',
  'vite.config.js',
];

let foundSecret = false;

console.log('🔍 Scanning for exposed secrets...\n');

for (const file of filesToCheck) {
  const filePath = path.join(rootDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`\u23ED\uFE0F  ${file} (not found, skipping)`);
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    for (const [secretType, pattern] of Object.entries(secretPatterns)) {
      if (pattern.test(content)) {
        console.error(`\u274C SECURITY ALERT: Found ${secretType} in ${file}`);
        foundSecret = true;
      }
    }

    if (!foundSecret) {
      console.log(`\u2705 ${file}`);
    }
  } catch (err) {
    console.error(`\u26A0\uFE0F  Error reading ${file}:`, err.message);
  }
}

console.log('\n' + '='.repeat(50));

if (foundSecret) {
  console.error('\n\u274C BUILD FAILED: Exposed secrets detected!');
  console.error('Remove API keys from code and store in .env.local or Vercel env vars.');
  process.exit(1);
} else {
  console.log('\n\u2705 No exposed secrets detected. Safe to commit.');
  process.exit(0);
}
