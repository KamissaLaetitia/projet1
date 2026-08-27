/**
 * ==============================================================================
 * MODULE DE SÉCURITÉ & SANITISATION DES DONNÉES (OWASP Hardening)
 * ==============================================================================
 */

/**
 * Nettoie et désinfecte une chaîne de caractères pour éliminer les risques XSS.
 * Échappe les balises HTML sensibles et retire les injections de scripts.
 */
export function sanitizeString(input: unknown): string {
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

/**
 * Nettoie récursivement un objet contenant des entrées utilisateur.
 */
export function sanitizeObject<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return sanitizeString(data) as unknown as T;
  if (Array.isArray(data)) {
    return data.map(item => sanitizeObject(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[sanitizeString(key)] = sanitizeObject(value);
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Validation stricte des fichiers d'images uploadés
 * - Contrôle de l'extension
 * - Contrôle du MIME-type
 * - Contrôle de la taille maximale (5 Mo par défaut)
 * - Blocage formel des SVG (vecteur fréquent de Stored XSS) et fichiers exécutables
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'] as const;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageUpload(file: { name: string; type: string; size: number }): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'Aucun fichier fourni.' };
  }

  // 1. Contrôle de la taille
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Le fichier dépasse la taille maximale autorisée de 5 Mo (taille reçue : ${(file.size / 1024 / 1024).toFixed(2)} Mo).`,
    };
  }

  // 2. Contrôle du type MIME
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé (${file.type || 'inconnu'}). Formats acceptés : JPEG, PNG, WEBP, GIF.`,
    };
  }

  // 3. Contrôle de l'extension du nom de fichier
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  if (!hasValidExtension) {
    return {
      valid: false,
      error: 'Extension de fichier invalide. Extensions acceptées : .jpg, .jpeg, .png, .webp, .gif.',
    };
  }

  // 4. Blocage strict des injections de doubles extensions ou fichiers suspects (ex: image.php.jpg)
  if (/\.(php|exe|sh|js|html|svg|phtml|cgi)\./i.test(lowerName)) {
    return {
      valid: false,
      error: 'Nom de fichier suspect détecté.',
    };
  }

  return { valid: true };
}

/**
 * Masque les messages d'erreur détaillés en production pour éviter l'exposition d'informations internes (OWASP A05).
 */
export function formatSafeErrorMessage(err: unknown): string {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev && err instanceof Error) {
    return err.message;
  }
  return 'Une erreur interne est survenue. Veuillez réessayer ultérieurement.';
}
