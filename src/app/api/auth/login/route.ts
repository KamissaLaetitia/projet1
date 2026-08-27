import { NextResponse } from 'next/server';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rateLimit';
import { verifyPassword, createSessionToken, hashPassword } from '@/lib/auth';
import { sanitizeString, formatSafeErrorMessage } from '@/lib/security';

// Identifiants administrateur configurables via variables d'environnement
// Définir ADMIN_DEFAULT_EMAIL et ADMIN_DEFAULT_PASSWORD dans le fichier .env.local
const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || '';
// Mot de passe haché PBKDF2 SHA-512 — doit être configuré via les variables d'environnement
const DEFAULT_INITIAL_HASH = process.env.ADMIN_DEFAULT_PASSWORD
  ? hashPassword(process.env.ADMIN_DEFAULT_PASSWORD)
  : '';
let currentAdminHash = DEFAULT_INITIAL_HASH;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  
  // 1. Protection Anti-Brute-Force (5 tentatives max par tranche de 15 minutes)
  const rateLimitResult = checkRateLimit(`login_${ip}`, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    lockoutDurationMs: 15 * 60 * 1000,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: `Trop de tentatives échouées. Votre adresse IP est temporairement bloquée pendant ${Math.ceil(
          (rateLimitResult.lockedInSeconds || 900) / 60
        )} minute(s) pour des raisons de sécurité.`,
        isLocked: true,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const email = sanitizeString(body.email || '').toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const twoFactorCode = typeof body.twoFactorCode === 'string' ? body.twoFactorCode.trim() : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    // 2. Vérification des identifiants
    const isEmailMatch = email === ADMIN_EMAIL.toLowerCase();
    const isPasswordMatch = isEmailMatch && verifyPassword(password, currentAdminHash);

    if (!isEmailMatch || !isPasswordMatch) {
      return NextResponse.json(
        {
          error: 'Identifiants invalides.',
          remainingAttempts: rateLimitResult.remaining,
        },
        { status: 401 }
      );
    }

    // 3. Optionnel : Vérification 2FA si fournie ou requise
    // Le code 2FA doit être configuré via la variable d'environnement ADMIN_2FA_CODE
    const expected2FACode = process.env.ADMIN_2FA_CODE || '';
    if (body.require2FA && (!expected2FACode || twoFactorCode !== expected2FACode)) {
      return NextResponse.json(
        { error: 'Code de sécurité à deux facteurs invalide.' },
        { status: 401 }
      );
    }

    // 4. Succès : Réinitialiser le compteur de tentatives
    resetRateLimit(`login_${ip}`);

    // 5. Générer le jeton de session signé
    const token = createSessionToken(email, 'admin', 8);

    // 6. Définir le Cookie de session sécurisé
    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: { email, role: 'admin' },
    });

    const isProd = process.env.NODE_ENV === 'production';
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 heures
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: formatSafeErrorMessage(err) },
      { status: 500 }
    );
  }
}
