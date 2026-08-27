import crypto from 'crypto';

/**
 * ==============================================================================
 * MODULE D'AUTHENTIFICATION, HACHAGE SÉCURISÉ & GESTION DES SESSIONS (OWASP A07)
 * ==============================================================================
 */

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'patisserie_royale_default_secure_secret_key_32_bytes_min_2026';

// ─── 1. HACHAGE SÉCURISÉ DE MOT DE PASSE (PBKDF2 SHA-512 + Sel Cryptographique) ─
const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Hache un mot de passe avec un sel cryptographique aléatoire de 16 octets.
 * Format retourné : salt:hash
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Vérifie un mot de passe en temps constant pour empêcher les attaques temporelles (Timing Attacks).
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHash] = parts;
    const computedHash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');

    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(originalHash, 'hex');

    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ─── 2. VALIDATION STRICTE DE LA COMPLEXITÉ DES MOTS DE PASSE ────────────────
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  if (password.length < 10) {
    errors.push('Le mot de passe doit comporter au moins 10 caractères.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre.');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─── 3. GESTION DES JETONS DE SESSION SIGNÉS (HMAC-SHA256) ───────────────────
export interface SessionPayload {
  email: string;
  role: 'admin' | 'staff';
  exp: number; // timestamp ms
  createdAt: number;
}

/**
 * Crée un jeton de session signé cryptographiquement.
 */
export function createSessionToken(email: string, role: 'admin' | 'staff' = 'admin', durationHours = 8): string {
  const payload: SessionPayload = {
    email,
    role,
    createdAt: Date.now(),
    exp: Date.now() + durationHours * 60 * 60 * 1000,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payloadB64).digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Vérifie et décode un jeton de session.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payloadB64).digest('base64url');

    const bufA = Buffer.from(signature, 'utf-8');
    const bufB = Buffer.from(expectedSignature, 'utf-8');

    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    // Vérifier l'expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ─── 4. RÉINITIALISATION SÉCURISÉE DU MOT DE PASSE (Jeton à usage unique) ────
interface ResetTokenRecord {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

const resetTokensStore = new Map<string, ResetTokenRecord>();

export function generatePasswordResetToken(email: string): string {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const record: ResetTokenRecord = {
    token: randomBytes,
    email,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    used: false,
  };
  resetTokensStore.set(randomBytes, record);
  return randomBytes;
}

export function verifyAndConsumeResetToken(token: string): { valid: boolean; email?: string; error?: string } {
  const record = resetTokensStore.get(token);
  if (!record) {
    return { valid: false, error: 'Jeton de réinitialisation invalide.' };
  }
  if (record.used) {
    return { valid: false, error: 'Ce jeton a déjà été utilisé.' };
  }
  if (Date.now() > record.expiresAt) {
    resetTokensStore.delete(token);
    return { valid: false, error: 'Ce jeton a expiré (durée de validité : 15 minutes).' };
  }

  // Marquer comme consommé immédiatement (single-use)
  record.used = true;
  resetTokensStore.delete(token);
  return { valid: true, email: record.email };
}

// ─── 5. DOUBLE FACTEUR D'AUTHENTIFICATION (2FA & Codes de secours) ────────────
export function generate2FACode(): string {
  // Génère un code OTP à 6 chiffres aléatoire cryptographique
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

export function generateBackupCodes(count = 5): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}
