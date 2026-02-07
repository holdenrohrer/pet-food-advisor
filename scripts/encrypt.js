/**
 * Encrypts the built site for secure deployment.
 * Uses AES-256-GCM with PBKDF2 key derivation.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { webcrypto } from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const crypto = webcrypto;

// Configuration
const PBKDF2_ITERATIONS = 600000; // OWASP 2023 recommendation
const SALT_LENGTH = 32;
const IV_LENGTH = 12; // 96 bits for GCM

async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
}

async function encrypt(plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  // Combine: salt (32) + iv (12) + ciphertext
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return Buffer.from(combined).toString('base64');
}

function collectFiles(dir, baseDir = dir) {
  const files = {};
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const relativePath = relative(baseDir, fullPath);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      Object.assign(files, collectFiles(fullPath, baseDir));
    } else {
      // Read as base64 for binary files, text for text files
      const ext = entry.split('.').pop().toLowerCase();
      const textExts = ['html', 'js', 'css', 'json', 'txt', 'svg', 'xml'];

      if (textExts.includes(ext)) {
        files[relativePath] = {
          type: 'text',
          content: readFileSync(fullPath, 'utf-8')
        };
      } else {
        files[relativePath] = {
          type: 'binary',
          content: readFileSync(fullPath).toString('base64')
        };
      }
    }
  }

  return files;
}

function generateDecryptionPage(encryptedPayload) {
  // Read the client-side decryption script
  const decryptScript = readFileSync(join(__dirname, 'decrypt-client.js'), 'utf-8')
    .replace('__PBKDF2_ITERATIONS__', PBKDF2_ITERATIONS)
    .replace('__SALT_LENGTH__', SALT_LENGTH)
    .replace('__IV_LENGTH__', IV_LENGTH);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pet Food Advisor</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    h1 { color: #333; margin-bottom: 8px; }
    p { color: #666; margin-bottom: 24px; }
    input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 16px;
    }
    input:focus { border-color: #667eea; outline: none; }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .error { color: #e53935; margin-top: 16px; display: none; }
    .spinner {
      display: none;
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #encrypted-data { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Pet Food Advisor</h1>
    <p>Enter password to access the demo</p>
    <form id="form">
      <input type="password" id="password" placeholder="Password" autofocus required>
      <button type="submit" id="btn">
        <span id="btn-text">Unlock</span>
        <div class="spinner" id="spinner"></div>
      </button>
    </form>
    <div class="error" id="error">Incorrect password</div>
  </div>

  <script id="encrypted-data" type="application/octet-stream">${encryptedPayload}</script>
  <script>${decryptScript}</script>
</body>
</html>`;
}

async function main() {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    console.error('Error: SITE_PASSWORD environment variable not set');
    process.exit(1);
  }

  const distDir = join(process.cwd(), 'dist');
  const outDir = join(process.cwd(), 'encrypted');

  if (!existsSync(distDir)) {
    console.error('Error: dist/ directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  console.log('Collecting files from dist/...');
  const files = collectFiles(distDir);
  console.log(`Found ${Object.keys(files).length} files`);

  console.log('Encrypting...');
  const payload = JSON.stringify(files);
  const encrypted = await encrypt(payload, password);
  console.log(`Encrypted payload size: ${(encrypted.length / 1024).toFixed(1)} KB`);

  console.log('Generating decryption page...');
  const html = generateDecryptionPage(encrypted);

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(join(outDir, 'index.html'), html);
  console.log('Done! Encrypted site written to encrypted/index.html');
}

main().catch(err => {
  console.error('Encryption failed:', err);
  process.exit(1);
});
