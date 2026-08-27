import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protection de l'espace Administrateur (/admin)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    // Si aucun cookie de session n'est présent, rediriger vers la page de login
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Vérification basique de structure (le décodage HMAC complet est géré au niveau API)
    const parts = sessionCookie.split('.');
    if (parts.length !== 2) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protection contre les requêtes POST/PUT/DELETE intersites suspectes (CSRF basique)
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method) && pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Si l'en-tête Origin est présent, s'assurer qu'il provient du même domaine
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: 'Requête d\'origine non autorisée (Origine rejetée).' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: 'Origine invalide.' }, { status: 400 });
      }
    }
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
