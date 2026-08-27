import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, PromoCode } from '@/lib/types';
import { PROMO_CODES } from '@/lib/data';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedPromo: PromoCode | null;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    options?: {
      portions?: number;
      customMessage?: string;
      quantity?: number;
      selectedFlavor?: string;
      includeCandles?: boolean;
      candleNumber?: number;
    }
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  clearCart: () => void;

  // Computed values
  getItemsCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedPromo: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, options) => {
        const portions = options?.portions || product.defaultPortions || 8;
        const quantity = options?.quantity || 1;
        const customMessage = options?.customMessage || '';
        const selectedFlavor = options?.selectedFlavor || '';
        const includeCandles = options?.includeCandles || false;
        const candleNumber = options?.candleNumber;

        // Calculate price based on portions
        let baseUnitPrice = product.discountPrice || product.price;
        if (product.portions && product.portions.length > 1 && product.pricePerPortion) {
          baseUnitPrice = product.pricePerPortion * portions;
        }

        const cartItemId = `${product.id}-${portions}-${customMessage}-${selectedFlavor}`;

        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === cartItemId);

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          } else {
            const newItem: CartItem = {
              id: cartItemId,
              product,
              quantity,
              selectedPortions: portions,
              customMessage,
              selectedFlavor,
              includeCandles,
              candleNumber,
              itemPrice: baseUnitPrice,
            };
            return { items: [...state.items, newItem], isOpen: true };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      applyPromoCode: (codeStr) => {
        const cleanCode = codeStr.trim().toUpperCase();
        const promo = PROMO_CODES.find(
          (p) => p.code.toUpperCase() === cleanCode && p.active
        );

        if (!promo) {
          return {
            success: false,
            message: 'Code promotionnel invalide ou expiré.',
          };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < promo.minAmount) {
          return {
            success: false,
            message: `Ce code nécessite un montant minimum de ${promo.minAmount.toLocaleString('fr-FR')} FCFA d'achat.`,
          };
        }

        set({ appliedPromo: promo });
        return {
          success: true,
          message: `Code ${promo.code} appliqué (-${promo.discountPercent}%) !`,
        };
      },

      removePromoCode: () => set({ appliedPromo: null }),

      clearCart: () => set({ items: [], appliedPromo: null }),

      getItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.itemPrice * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const { appliedPromo } = get();
        const subtotal = get().getSubtotal();
        if (!appliedPromo) return 0;
        return (subtotal * appliedPromo.discountPercent) / 100;
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Livraison gratuite dès 30 000 FCFA, sinon 2 500 FCFA
        return subtotal >= 30000 ? 0 : 2500;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryFee();
        return Math.max(0, subtotal - discount + delivery);
      },
    }),
    {
      name: 'patisserie-cart-storage',
      partialize: (state) => ({ items: state.items, appliedPromo: state.appliedPromo }),
    }
  )
);
