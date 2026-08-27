export type ProductCategory = 
  | 'anniversaire'
  | 'mariage'
  | 'cupcakes'
  | 'personnalises'
  | 'entremets'
  | 'coffrets';

export interface Category {
  id: string;
  name: string;
  slug: ProductCategory;
  description: string;
  imageUrl: string;
  iconName?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  categoryName: string;
  imageUrl: string;
  additionalImages?: string[];
  stock: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isPromotion?: boolean;
  rating: number;
  reviewsCount: number;
  portions: number[]; // e.g. [6, 8, 12, 20]
  defaultPortions: number;
  pricePerPortion?: number;
  ingredients: string[];
  allergens: string[];
  preparationTimeHours: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedPortions: number;
  customMessage?: string;
  selectedFlavor?: string;
  includeCandles?: boolean;
  candleNumber?: number;
  itemPrice: number; // calculated according to portions
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'in_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  portions: number;
  customMessage?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  deliveryMethod: 'livraison_express' | 'retrait_boutique';
  paymentMethod: 'carte' | 'paypal' | 'livraison';
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  authorName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
  occasion?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minAmount: number;
  description: string;
  active: boolean;
}

export interface CustomCakeRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: 'anniversaire' | 'mariage' | 'bapteme' | 'entreprise' | 'autre';
  guestCount: number;
  eventDate: string;
  budgetRange: string;
  flavorPreference: string;
  description: string;
  status: 'nouveau' | 'devis_envoye' | 'valide' | 'refuse';
  createdAt: string;
}
