// Client-side decryption script
// Values are replaced at build time
const ENCRYPTED_DATA = document.getElementById('encrypted-data').textContent;
const PBKDF2_ITERATIONS = __PBKDF2_ITERATIONS__;
const SALT_LENGTH = __SALT_LENGTH__;
const IV_LENGTH = __IV_LENGTH__;
const STORAGE_KEY = 'pfa_session';

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
    ['decrypt']
  );
}

async function decrypt(encryptedBase64, password) {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'js': 'application/javascript',
    'css': 'text/css',
    'html': 'text/html',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
  };
  return types[ext] || 'application/octet-stream';
}

async function tryDecrypt(password, showError = true) {
  const btn = document.getElementById('btn');
  const btnText = document.getElementById('btn-text');
  const spinner = document.getElementById('spinner');
  const error = document.getElementById('error');

  if (btn) {
    btn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'block';
  }
  if (error) error.style.display = 'none';

  try {
    const decrypted = await decrypt(ENCRYPTED_DATA, password);
    const files = JSON.parse(decrypted);

    // Success - store password for next time
    sessionStorage.setItem(STORAGE_KEY, password);

    // Create blob URLs for assets
    const blobUrls = {};
    for (const [path, file] of Object.entries(files)) {
      if (path !== 'index.html') {
        const content = file.type === 'binary'
          ? base64ToBlob(file.content, getMimeType(path))
          : new Blob([file.content], { type: getMimeType(path) });
        blobUrls[path] = URL.createObjectURL(content);
      }
    }

    // Get index.html and replace asset references
    let html = files['index.html'].content;

    // Replace asset paths with blob URLs
    for (const [path, url] of Object.entries(blobUrls)) {
      html = html.split('./' + path).join(url);
      html = html.split('/' + path).join(url);
      html = html.split('"' + path + '"').join('"' + url + '"');
    }

    // Replace document
    document.open();
    document.write(html);
    document.close();
    return true;

  } catch (err) {
    console.error('Decryption failed:', err);
    if (showError && error) error.style.display = 'block';
    if (btn) {
      btn.disabled = false;
      btnText.style.display = 'inline';
      spinner.style.display = 'none';
    }
    return false;
  }
}

// Try cached password on load
const cachedPassword = sessionStorage.getItem(STORAGE_KEY);
if (cachedPassword) {
  tryDecrypt(cachedPassword, false);
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  await tryDecrypt(password, true);
});
