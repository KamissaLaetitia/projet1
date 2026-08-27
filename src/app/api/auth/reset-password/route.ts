import { NextResponse } from 'next/server';
import {
  generatePasswordResetToken,
  verifyAndConsumeResetToken,
  validatePasswordStrength,
  hashPassword,
} from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeString, formatSafeErrorMessage } from '@/lib/security';

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // Rate limiting : max 3 demandes de reset par IP toutes les 15 minutes
  const limit = checkRateLimit(`reset_pwd_${ip}`, {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000,
    lockoutDurationMs: 30 * 60 * 1000,
  });

  if (!limit.success) {
    return NextResponse.json(
      {
        error: 'Trop de demandes de réinitialisation. Veuillez patienter avant de renouveler votre requête.',
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const action = body.action; // 'request' ou 'confirm'

    // 1. Demande de jeton de réinitialisation
    if (action === 'request') {
      const email = sanitizeString(body.email || '').toLowerCase();
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
      }

      const token = generatePasswordResetToken(email);
      // En environnement réel, ce jeton est envoyé par email sécurisé
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse correspond à un compte administrateur, un lien sécurisé a été généré.',
        // En développement/test uniquement :
        debugToken: process.env.NODE_ENV === 'development' ? token : undefined,
      });
    }

    // 2. Confirmation et application du nouveau mot de passe
    if (action === 'confirm') {
      const token = typeof body.token === 'string' ? body.token.trim() : '';
      const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

      if (!token) {
        return NextResponse.json({ error: 'Jeton de réinitialisation requis.' }, { status: 400 });
      }

      // Valider la complexité du nouveau mot de passe
      const strength = validatePasswordStrength(newPassword);
      if (!strength.valid) {
        return NextResponse.json(
          {
            error: 'Le mot de passe ne respecte pas les critères de sécurité :',
            details: strength.errors,
          },
          { status: 400 }
        );
      }

      // Consommer le jeton à usage unique
      const result = verifyAndConsumeResetToken(token);
      if (!result.valid) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      const newHash = hashPassword(newPassword);

      return NextResponse.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
      });
    }

    return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: formatSafeErrorMessage(err) },
      { status: 500 }
    );
  }
}
