import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { localStore, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { sanitizeObject, formatSafeErrorMessage } from '@/lib/security';
import { verifySessionToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(req: Request) {
  const ip = getClientIp(req);
  // Rate limit : max 100 requêtes catalogue par minute
  const limit = checkRateLimit(`get_products_${ip}`, { maxAttempts: 100, windowMs: 60 * 1000 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Trop de requêtes.' }, { status: 429 });
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    }
    const products = localStore.getProducts();
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json(INITIAL_PRODUCTS);
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // 1. Vérification d'authentification Administrateur (OWASP A01 - Broken Access Control)
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = sessionCookie || authHeader;

  if (!token) {
    return NextResponse.json(
      { error: 'Accès non autorisé. Authentification requise pour modifier le catalogue.' },
      { status: 401 }
    );
  }

  const payload = verifySessionToken(token);
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json(
      { error: 'Permissions insuffisantes. Rôle administrateur requis.' },
      { status: 403 }
    );
  }

  // 2. Limitation de débit pour les créations
  const limit = checkRateLimit(`post_products_${ip}`, { maxAttempts: 30, windowMs: 15 * 60 * 1000 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Limite de créations atteinte.' }, { status: 429 });
  }

  try {
    const rawBody = await req.json();
    // 3. Sanitisation stricte des champs
    const body = sanitizeObject(rawBody);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').insert([body]).select();
      if (!error && data) {
        return NextResponse.json(data[0], { status: 201 });
      }
    }
    const saved = localStore.saveProduct(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: formatSafeErrorMessage(err) },
      { status: 500 }
    );
  }
}
