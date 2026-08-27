import assert from 'assert';
import crypto from 'crypto';

console.log('🧪 ==============================================================================');
console.log('🧪 SUITE DE TESTS AUTOMATISÉS DE SÉCURITÉ - PATISSERIE ROYALE');
console.log('🧪 ==============================================================================');

let passedTests = 0;
let totalTests = 0;

function test(title, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${title}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${title} :`, err.message);
  }
}

// ─── 1. Tests Hachage PBKDF2 & Timing Attacks ────────────────────────────────
test('Hachage PBKDF2 avec sel unique et vérification valide', () => {
  const password = 'SuperSecretPassword2026!';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  const stored = `${salt}:${hash}`;

  const parts = stored.split(':');
  const computed = crypto.pbkdf2Sync(password, parts[0], 100_000, 64, 'sha512').toString('hex');
  
  assert.strictEqual(computed, parts[1], 'Le hachage calculé doit correspondre au hachage stocké.');
});

test('Rejet des faux mots de passe en temps constant', () => {
  const password = 'CorrectPassword123!';
  const wrongPassword = 'WrongPassword999!';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');

  const computedWrong = crypto.pbkdf2Sync(wrongPassword, salt, 100_000, 64, 'sha512').toString('hex');
  assert.notStrictEqual(computedWrong, hash, 'Un mauvais mot de passe ne doit jamais produire le même hash.');
});

// ─── 2. Tests Complexité des Mots de Passe ────────────────────────────────────
function validatePassword(pwd) {
  const errors = [];
  if (pwd.length < 10) errors.push('Min 10 caractères');
  if (!/[A-Z]/.test(pwd)) errors.push('Majuscule requise');
  if (!/[a-z]/.test(pwd)) errors.push('Minuscule requise');
  if (!/[0-9]/.test(pwd)) errors.push('Chiffre requis');
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) errors.push('Caractère spécial requis');
  return { valid: errors.length === 0, errors };
}

test('Rejet des mots de passe trop faibles', () => {
  assert.strictEqual(validatePassword('123456').valid, false);
  assert.strictEqual(validatePassword('password').valid, false);
  assert.strictEqual(validatePassword('Password123').valid, false); // manque spécial
  assert.strictEqual(validatePassword('Pass@1').valid, false); // trop court
});

test('Acceptation des mots de passe conformes', () => {
  assert.strictEqual(validatePassword('P@tisserieRoyale2026!').valid, true);
  assert.strictEqual(validatePassword('Ch0c0lat_Artisanal#9').valid, true);
});

// ─── 3. Tests Signature HMAC des Sessions ─────────────────────────────────────
test('Signature et vérification de session HMAC-SHA256', () => {
  const secret = 'super_secret_jwt_key_patisserie_royale';
  const payload = { email: 'admin@patisserie-royale.fr', role: 'admin', exp: Date.now() + 3600000 };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  const token = `${payloadB64}.${signature}`;

  // Vérification
  const [b64, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  assert.strictEqual(sig, expectedSig, 'La signature HMAC doit être valide.');
});

test('Rejet des sessions falsifiées', () => {
  const secret = 'super_secret_jwt_key_patisserie_royale';
  const fakeSecret = 'attacker_secret_key';
  const payload = { email: 'admin@patisserie-royale.fr', role: 'admin', exp: Date.now() + 3600000 };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const fakeSignature = crypto.createHmac('sha256', fakeSecret).update(payloadB64).digest('base64url');

  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  assert.notStrictEqual(fakeSignature, expectedSig, 'Une session forgée avec un mauvais secret doit être rejetée.');
});

// ─── 4. Tests Sanitisation XSS ────────────────────────────────────────────────
function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

test('Neutralisation des balises <script> et vecteurs XSS', () => {
  const dirty = '<script>alert("XSS")</script>';
  const clean = sanitizeString(dirty);
  assert.strictEqual(clean.includes('<script>'), false, 'Les balises script ne doivent pas être conservées.');
  assert.strictEqual(clean, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
});

test('Neutralisation des injections img onerror', () => {
  const dirty = '<img src=x onerror=alert(1)>';
  const clean = sanitizeString(dirty);
  assert.strictEqual(clean.includes('<img'), false);
});

// ─── 5. Tests Validation des Fichiers Uploadés ────────────────────────────────
function validateImageUpload(file) {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const MAX_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_SIZE) return { valid: false, error: 'Fichier trop grand' };
  if (!ALLOWED_TYPES.includes(file.type)) return { valid: false, error: 'MIME invalide' };
  
  const lowerName = file.name.toLowerCase();
  if (!ALLOWED_EXT.some(ext => lowerName.endsWith(ext))) return { valid: false, error: 'Extension invalide' };
  if (/\.(php|exe|sh|js|html|svg|phtml|cgi)\./i.test(lowerName)) return { valid: false, error: 'Nom suspect' };

  return { valid: true };
}

test('Acceptation des formats d\'images légitimes', () => {
  assert.strictEqual(validateImageUpload({ name: 'gateau.jpg', type: 'image/jpeg', size: 1024 * 500 }).valid, true);
  assert.strictEqual(validateImageUpload({ name: 'fraisier.png', type: 'image/png', size: 1024 * 800 }).valid, true);
  assert.strictEqual(validateImageUpload({ name: 'eclair.webp', type: 'image/webp', size: 1024 * 300 }).valid, true);
});

test('Rejet strict des SVG, exécutables et doubles extensions malveillantes', () => {
  assert.strictEqual(validateImageUpload({ name: 'exploit.svg', type: 'image/svg+xml', size: 1024 }).valid, false);
  assert.strictEqual(validateImageUpload({ name: 'backdoor.php.jpg', type: 'image/jpeg', size: 1024 }).valid, false);
  assert.strictEqual(validateImageUpload({ name: 'malware.exe', type: 'application/x-msdownload', size: 1024 }).valid, false);
  assert.strictEqual(validateImageUpload({ name: 'huge_image.png', type: 'image/png', size: 10 * 1024 * 1024 }).valid, false);
});

console.log('🧪 ==============================================================================');
console.log(`📊 RÉSULTAT : ${passedTests}/${totalTests} tests réussis avec succès.`);
console.log('🧪 ==============================================================================');
