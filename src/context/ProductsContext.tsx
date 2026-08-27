'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { localStore } from '@/lib/supabase';

interface ProductsContextType {
  products: Product[];
  refreshProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  refreshProducts: () => {},
});

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProducts = useCallback(() => {
    setProducts(localStore.getProducts());
  }, []);

  useEffect(() => {
    // Initial load
    refreshProducts();

    // Réagir aux changements faits dans d'autres onglets (admin → public)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'patisserie_products') {
        refreshProducts();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshProducts]);

  return (
    <ProductsContext.Provider value={{ products, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
