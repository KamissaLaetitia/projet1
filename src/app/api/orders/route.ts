import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { localStore, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_ORDERS } from '@/lib/data';
import { sanitizeObject, sanitizeString, formatSafeErrorMessage } from '@/lib/security';
import { verifySessionToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');

  // Si un numéro de commande spécifique est demandé (ex: Suivi de commande client)
  if (orderNumber) {
    const cleanNum = sanitizeString(orderNumber).trim().toUpperCase();
    const order = localStore.getOrderByNumber(cleanNum);
    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    }
    // Filtrer les données sensibles pour le suivi public (masquer les coordonnées complètes)
    return NextResponse.json({
      orderNumber: order.orderNumber,
      customerName: order.customerName.split(' ')[0] + ' ***',
      deliveryDate: order.deliveryDate,
      deliveryTimeSlot: order.deliveryTimeSlot,
      status: order.status,
      itemsCount: order.items.length,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    });
  }

  // Si demande de la liste complète de TOUTES les commandes -> Authentification Administrateur obligatoire (OWASP A01 & IDOR)
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = sessionCookie || authHeader;

  if (!token) {
    return NextResponse.json(
      { error: 'Accès restreint. Authentification requise pour consulter les commandes.' },
      { status: 401 }
    );
  }

  const payload = verifySessionToken(token);
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json(
      { error: 'Permissions insuffisantes.' },
      { status: 403 }
    );
  }

  // Rate limit
  checkRateLimit(`get_orders_admin_${ip}`, { maxAttempts: 60, windowMs: 60 * 1000 });

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('orders').select('*, order_items(*)');
      if (!error && data) {
        return NextResponse.json(data);
      }
    }
    const orders = localStore.getOrders();
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json(INITIAL_ORDERS);
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // Rate limiting : max 10 créations de commande par 15 minutes par IP pour bloquer le spam / déni de service
  const limit = checkRateLimit(`post_order_${ip}`, {
    maxAttempts: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: 'Trop de requêtes de commande. Veuillez patienter quelques instants.' },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);

    // Validation minimale des champs essentiels
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.items) {
      return NextResponse.json(
        { error: 'Données de commande incomplètes ou invalides.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('orders').insert([body]).select();
      if (!error && data) {
        return NextResponse.json(data[0], { status: 201 });
      }
    }
    const saved = localStore.addOrder(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: formatSafeErrorMessage(err) },
      { status: 500 }
    );
  }
}
