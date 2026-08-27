import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, REVIEWS } from './data';
import { Product, Order, Review, CustomCakeRequest } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage for stateful mock operations
class LocalStore {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private reviews: Review[] = [...REVIEWS];
  private customRequests: CustomCakeRequest[] = [];

  getProducts(): Product[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('patisserie_products');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return this.products;
  }

  saveProduct(product: Partial<Product>): Product {
    const products = this.getProducts();
    let updated: Product;
    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...product } as Product;
        updated = products[idx];
      } else {
        updated = { ...INITIAL_PRODUCTS[0], ...product, id: `cake-${Date.now()}` } as Product;
        products.unshift(updated);
      }
    } else {
      updated = {
        id: `cake-${Date.now()}`,
        name: product.name || 'Nouveau Gâteau',
        slug: (product.name || 'nouveau-gateau').toLowerCase().replace(/\s+/g, '-'),
        tagline: product.tagline || '',
        description: product.description || '',
        price: Number(product.price) || 45,
        discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
        category: product.category || 'anniversaire',
        categoryName: product.categoryName || 'Gâteaux d\'Anniversaire',
        imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        stock: Number(product.stock) || 10,
        isFeatured: Boolean(product.isFeatured),
        isPopular: Boolean(product.isPopular),
        isNew: Boolean(product.isNew),
        isPromotion: Boolean(product.isPromotion),
        rating: 5.0,
        reviewsCount: 1,
        portions: [6, 8, 12, 16],
        defaultPortions: product.defaultPortions || 8,
        ingredients: ['Ingrédients artisanaux bio', 'Chocolat pur', 'Beurre AOP'],
        allergens: ['Lactose', 'Gluten', 'Œufs'],
        preparationTimeHours: product.preparationTimeHours || 24,
      };
      products.unshift(updated);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('patisserie_products', JSON.stringify(products));
    }
    this.products = products;
    return updated;
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts().filter(p => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('patisserie_products', JSON.stringify(products));
    }
    this.products = products;
    return true;
  }

  getOrders(): Order[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('patisserie_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return this.orders;
  }

  addOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    if (typeof window !== 'undefined') {
      localStorage.setItem('patisserie_orders', JSON.stringify(orders));
    }
    this.orders = orders;
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem('patisserie_orders', JSON.stringify(orders));
      }
      return order;
    }
    return null;
  }

  getOrderByNumber(orderNumber: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase()) || null;
  }
}

export const localStore = new LocalStore();
