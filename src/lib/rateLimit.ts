/**
 * ==============================================================================
 * MODULE DE LIMITATION DE DÉBIT & PROTECTION ANTI-BRUTE-FORCE (Rate Limiter)
 * ==============================================================================
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
  lockedUntil?: number;
}

// Magasin en mémoire pour le suivi des tentatives par clé (IP ou identifiant)
const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  /** Fenêtre temporelle en millisecondes (défaut : 15 minutes) */
  windowMs?: number;
  /** Nombre maximum de tentatives autorisées dans la fenêtre (défaut : 5) */
  maxAttempts?: number;
  /** Durée du verrouillage temporaire en ms après dépassement (défaut : 15 minutes) */
  lockoutDurationMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
  isLocked: boolean;
  lockedInSeconds?: number;
}

/**
 * Vérifie et incrémente le compteur de tentatives pour une clé donnée.
 */
export function checkRateLimit(key: string, options: RateLimitOptions = {}): RateLimitResult {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 min
  const maxAttempts = options.maxAttempts || 5;
  const lockoutDurationMs = options.lockoutDurationMs || 15 * 60 * 1000; // 15 min

  const now = Date.now();
  let record = rateLimitMap.get(key);

  // Nettoyage si expiré
  if (record && now > record.resetAt && (!record.lockedUntil || now > record.lockedUntil)) {
    rateLimitMap.delete(key);
    record = undefined;
  }

  // Vérification de verrouillage en cours
  if (record && record.lockedUntil && now < record.lockedUntil) {
    const lockedInSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds: lockedInSeconds,
      isLocked: true,
      lockedInSeconds,
    };
  }

  // Nouveau cycle
  if (!record) {
    record = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(key, record);
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
      isLocked: false,
    };
  }

  // Incrémenter
  record.count += 1;

  if (record.count > maxAttempts) {
    record.lockedUntil = now + lockoutDurationMs;
    const lockedInSeconds = Math.ceil(lockoutDurationMs / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds: lockedInSeconds,
      isLocked: true,
      lockedInSeconds,
    };
  }

  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    isLocked: false,
  };
}

/**
 * Réinitialise le compteur après un succès (ex: mot de passe valide).
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Récupère l'adresse IP du client depuis les en-têtes standards de la requête.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
