'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Search,
  DollarSign,
  Save,
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Star,
  Crown,
  AlertCircle,
  ZoomIn,
  Trash,
  Camera,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductCategory } from '@/lib/types';
import { localStore } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import { CATEGORIES } from '@/lib/data';
import { useProducts } from '@/context/ProductsContext';
import { validateImageUpload } from '@/lib/security';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const { products, refreshProducts } = useProducts();
  
  const [orders, setOrders] = useState<Order[]>([]);

  // Product Edit / Add Modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Photo management state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [sizeWarning, setSizeWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Search & Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  useEffect(() => {
    setOrders(localStore.getOrders());
  }, []);

  // Compute Stats
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'cancelled' ? ord.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // ─── Handlers: Products ─────────────────────────────────────────────────────
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    localStore.saveProduct(editingProduct);
    refreshProducts();
    // Dispatch custom event so other tabs/windows update instantly
    window.dispatchEvent(new StorageEvent('storage', { key: 'patisserie_products' }));

    setPhotoSaved(true);
    setTimeout(() => setPhotoSaved(false), 2500);
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewImageUrl('');
    setSizeWarning(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce gâteau du catalogue ?')) {
      localStore.deleteProduct(id);
      refreshProducts();
      window.dispatchEvent(new StorageEvent('storage', { key: 'patisserie_products' }));
    }
  };

  // ─── Handlers: Photo Management ─────────────────────────────────────────────
  const addPhotoToProduct = useCallback((dataUrl: string) => {
    // Warn if very large (>1MB base64 ≈ 750KB file)
    if (dataUrl.length > 1_000_000) setSizeWarning(true);
    setEditingProduct((prev) => {
      if (!prev) return prev;
      if (!prev.imageUrl) return { ...prev, imageUrl: dataUrl };
      const current = prev.additionalImages || [];
      return { ...prev, additionalImages: [...current, dataUrl] };
    });
  }, []);

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim() || !editingProduct) return;
    addPhotoToProduct(newImageUrl.trim());
    setNewImageUrl('');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/admin/login');
    router.refresh();
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      // 1. Validation de sécurité stricte (type MIME, extension, taille max 5Mo)
      const validation = validateImageUpload(file);
      if (!validation.valid) {
        alert(validation.error || 'Fichier non valide.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string;
        if (dataUrl) addPhotoToProduct(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }, [addPhotoToProduct]);

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeletePhoto = (photoUrl: string) => {
    if (!editingProduct) return;
    if (previewPhoto === photoUrl) setPreviewPhoto(null);
    if (editingProduct.imageUrl === photoUrl) {
      const remaining = editingProduct.additionalImages || [];
      setEditingProduct({
        ...editingProduct,
        imageUrl: remaining[0] || '',
        additionalImages: remaining.slice(1),
      });
    } else {
      const currentList = editingProduct.additionalImages || [];
      setEditingProduct({
        ...editingProduct,
        additionalImages: currentList.filter((img) => img !== photoUrl),
      });
    }
  };

  const handleSetPrimaryPhoto = (photoUrl: string) => {
    if (!editingProduct || editingProduct.imageUrl === photoUrl) return;
    const oldPrimary = editingProduct.imageUrl;
    const currentList = editingProduct.additionalImages || [];
    const filtered = currentList.filter((img) => img !== photoUrl);
    setEditingProduct({
      ...editingProduct,
      imageUrl: photoUrl,
      additionalImages: oldPrimary ? [oldPrimary, ...filtered] : filtered,
    });
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    localStore.updateOrderStatus(orderId, newStatus);
    setOrders(localStore.getOrders());
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
  );

  // All photos for the current edited product
  const currentProductPhotos = editingProduct
    ? [
        ...(editingProduct.imageUrl ? [editingProduct.imageUrl] : []),
        ...(editingProduct.additionalImages || []),
      ]
    : [];

  return (
    <div className="bg-caffeine-dark min-h-screen pb-24">
      
      {/* Admin Header */}
      <div className="bg-caffeine-darker border-b border-caffeine-cardBorder py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Back-Office de Gestion</span>
            </div>
            <h1 className="font-display font-black text-xl sm:text-3xl text-caffeine-cream">
              Espace Vendeuse & <span className="gold-gradient-text">Administration</span>
            </h1>
          </div>

          {/* Quick Tab Selector & Logout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 bg-white border border-caffeine-cardBorder p-1 sm:p-1.5 rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-caffeine-gold text-white font-black shadow-gold-sm'
                    : 'text-caffeine-cream/80 hover:text-caffeine-gold'
                }`}
              >
                Vue Générale
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'products'
                    ? 'bg-caffeine-gold text-white font-black shadow-gold-sm'
                    : 'text-caffeine-cream/80 hover:text-caffeine-gold'
                }`}
              >
                Gâteaux & Photos ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-caffeine-gold text-white font-black shadow-gold-sm'
                    : 'text-caffeine-cream/80 hover:text-caffeine-gold'
                }`}
              >
                Commandes ({orders.length})
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 sm:p-2.5 rounded-2xl bg-white border border-caffeine-cardBorder hover:border-red-500 text-caffeine-subtle hover:text-red-600 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold shrink-0"
              title="Déconnexion sécurisée"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ========================================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Stat KPI Cards in FCFA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.07)]">
                <div className="flex items-center justify-between text-caffeine-subtle mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Chiffre d&apos;Affaires</span>
                  <div className="w-9 h-9 rounded-xl bg-caffeine-gold/20 text-caffeine-gold flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <span className="font-display font-black text-2xl text-caffeine-gold">
                  {formatPrice(totalRevenue)}
                </span>
                <span className="text-[11px] text-green-600 font-bold block mt-1">✓ Ventes enregistrées en FCFA</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.07)]">
                <div className="flex items-center justify-between text-caffeine-subtle mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Commandes Actives</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <span className="font-display font-black text-2xl sm:text-3xl text-caffeine-cream">
                  {pendingOrdersCount}
                </span>
                <span className="text-[11px] text-caffeine-subtle block mt-1 font-medium">À préparer ou expédier</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.07)]">
                <div className="flex items-center justify-between text-caffeine-subtle mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Gâteaux au Catalogue</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <span className="font-display font-black text-2xl sm:text-3xl text-caffeine-cream">
                  {products.length}
                </span>
                <span className="text-[11px] text-caffeine-subtle block mt-1 font-medium">6 Catégories actives</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.07)]">
                <div className="flex items-center justify-between text-caffeine-subtle mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Alertes Stock</span>
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <span className="font-display font-black text-2xl sm:text-3xl text-red-500">
                  {lowStockProducts.length}
                </span>
                <span className="text-[11px] text-red-500 block mt-1 font-bold">Stock inférieur à 10</span>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders List (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-caffeine-cardBorder">
                  <h3 className="font-display font-bold text-lg text-caffeine-cream">
                    Dernières Commandes Clients
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-caffeine-gold hover:underline font-bold"
                  >
                    Voir tout ({orders.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-caffeine-gold">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-caffeine-cream font-bold">
                            {order.customerName}
                          </span>
                        </div>
                        <span className="text-[11px] text-caffeine-subtle block mt-0.5 font-medium">
                          {order.items.length} article(s) • Prévu le {order.deliveryDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-sm text-caffeine-cream">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-caffeine-cardBorder text-xs text-caffeine-gold font-bold focus:outline-none shadow-sm"
                        >
                          <option value="confirmed">Confirmée</option>
                          <option value="preparing">En préparation</option>
                          <option value="in_delivery">En livraison</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Warning Box (5 cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-caffeine-cardBorder">
                  <h3 className="font-display font-bold text-lg text-caffeine-cream flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Stocks à Réapprovisionner</span>
                  </h3>
                  <span className="text-xs text-red-500 font-bold">{lowStockProducts.length} alertes</span>
                </div>

                <div className="space-y-3">
                  {lowStockProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white border border-caffeine-cardBorder/60"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-caffeine-cream line-clamp-1">{prod.name}</h4>
                          <span className="text-[10px] text-caffeine-subtle font-medium">{prod.categoryName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-600 border border-red-200">
                          {prod.stock} restants
                        </span>
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white border border-caffeine-cardBorder text-caffeine-subtle hover:text-caffeine-gold shadow-sm"
                          title="Modifier le stock & photos"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. PRODUCTS & PHOTO MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-caffeine-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un gâteau..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-caffeine-cardBorder text-xs text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold shadow-sm"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    tagline: '',
                    description: '',
                    price: 30000,
                    stock: 10,
                    category: 'anniversaire',
                    categoryName: 'Gâteaux d\'Anniversaire',
                    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
                    additionalImages: [],
                    defaultPortions: 8,
                    preparationTimeHours: 24,
                  });
                  setIsModalOpen(true);
                }}
                className="btn-caffeine-primary text-xs !py-3 !px-6 flex items-center gap-2 shadow-gold-sm w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Nouveau Gâteau & Photos</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] overflow-x-auto">
              <table className="w-full text-left text-xs text-caffeine-cream">
                <thead className="border-b border-caffeine-cardBorder text-[11px] uppercase tracking-wider text-caffeine-subtle font-bold">
                  <tr>
                    <th className="pb-3">Gâteau & Photos</th>
                    <th className="pb-3">Catégorie</th>
                    <th className="pb-3">Prix (FCFA)</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Galerie Photos</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-caffeine-cardBorder/60">
                  {filteredProducts.map((prod) => {
                    const photosCount = 1 + (prod.additionalImages ? prod.additionalImages.length : 0);
                    return (
                      <tr key={prod.id} className="hover:bg-caffeine-surface/60 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-white flex-shrink-0 border border-caffeine-cardBorder shadow-sm"
                            />
                            <div>
                              <h4 className="font-bold text-sm text-caffeine-cream">{prod.name}</h4>
                              <span className="text-[11px] text-caffeine-subtle line-clamp-1 max-w-xs font-medium">{prod.tagline}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-caffeine-gold">{prod.categoryName}</td>
                        <td className="py-4 font-display font-black text-sm text-caffeine-gold">
                          {formatPrice(prod.discountPrice || prod.price)}
                          {prod.discountPrice && (
                            <span className="text-[10px] text-caffeine-muted line-through ml-1.5 block font-medium">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            prod.stock < 10 ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-green-700'
                          }`}>
                            {prod.stock} unités
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder hover:border-caffeine-gold text-caffeine-cream text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-caffeine-gold" />
                            <span>{photosCount} photo(s)</span>
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-white border border-caffeine-cardBorder hover:border-caffeine-gold text-caffeine-cream hover:text-caffeine-gold transition-colors shadow-sm"
                              title="Modifier gâteau & gérer photos"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 rounded-xl bg-white border border-caffeine-cardBorder hover:border-red-500 text-caffeine-subtle hover:text-red-500 transition-colors shadow-sm"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ORDERS MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-caffeine-subtle font-bold mr-2">Statut :</span>
              {['all', 'confirmed', 'preparing', 'in_delivery', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    orderStatusFilter === st
                      ? 'bg-caffeine-gold text-white border-caffeine-gold shadow-gold-sm'
                      : 'bg-white border-caffeine-cardBorder text-caffeine-cream hover:border-caffeine-gold/50 shadow-sm'
                  }`}
                >
                  {st === 'all' ? 'Toutes les commandes' : st.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] overflow-x-auto">
              <table className="w-full text-left text-xs text-caffeine-cream">
                <thead className="border-b border-caffeine-cardBorder text-[11px] uppercase tracking-wider text-caffeine-subtle font-bold">
                  <tr>
                    <th className="pb-3">N° Commande</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Date & Créneau</th>
                    <th className="pb-3">Articles</th>
                    <th className="pb-3">Total (FCFA)</th>
                    <th className="pb-3">Statut de Confection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-caffeine-cardBorder/60">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-caffeine-surface/60 transition-colors">
                      <td className="py-4 font-mono font-bold text-caffeine-gold">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4">
                        <strong className="text-caffeine-cream block font-bold">{ord.customerName}</strong>
                        <span className="text-[11px] text-caffeine-subtle font-medium">{ord.customerPhone}</span>
                      </td>
                      <td className="py-4">
                        <span className="block font-semibold">{ord.deliveryDate}</span>
                        <span className="text-[11px] text-caffeine-subtle">{ord.deliveryTimeSlot}</span>
                      </td>
                      <td className="py-4">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-caffeine-cream font-medium">
                            {it.quantity}x {it.productName} ({it.portions}p)
                          </div>
                        ))}
                      </td>
                      <td className="py-4 font-display font-black text-sm text-caffeine-gold">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs text-caffeine-gold font-bold focus:outline-none focus:border-caffeine-gold shadow-sm"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="preparing">En préparation</option>
                          <option value="in_delivery">En livraison</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT & PHOTO MANAGEMENT MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-3xl bg-white border border-caffeine-gold/50 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-caffeine-cardBorder">
              <div>
                <span className="text-[10px] uppercase font-bold text-caffeine-gold tracking-widest block">
                  Gestion du Produit & Photos
                </span>
                <h3 className="font-display font-black text-xl text-caffeine-cream">
                  {editingProduct.id ? `Modifier : ${editingProduct.name}` : 'Ajouter un Nouveau Gâteau'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-caffeine-subtle hover:text-caffeine-cream hover:bg-caffeine-surface rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* GESTION DES PHOTOS — DRAG & DROP + UPLOAD + URL               */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <div className="p-5 rounded-2xl bg-caffeine-surface border border-caffeine-gold/35 space-y-4 shadow-sm">

                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-caffeine-cream flex items-center gap-2">
                    <Camera className="w-4 h-4 text-caffeine-gold" />
                    <span>Galerie Photos <span className="text-caffeine-gold">({currentProductPhotos.length})</span></span>
                  </h4>
                  <span className="text-[10px] text-caffeine-subtle font-medium">
                    ⭐ = Photo couverture du catalogue
                  </span>
                </div>

                {/* Size Warning */}
                {sizeWarning && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <strong>Photo volumineuse :</strong> Les images uploadées depuis l&apos;appareil sont stockées localement. Pour de meilleures performances, préférez une URL externe (ex: Unsplash, Cloudinary).
                    </span>
                  </div>
                )}

                {/* ── Drag & Drop Zone ── */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 py-8 px-4 text-center ${
                    isDragging
                      ? 'border-caffeine-gold bg-caffeine-gold/10 scale-[1.01]'
                      : 'border-caffeine-cardBorder hover:border-caffeine-gold/60 hover:bg-white bg-white/60 shadow-sm'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => { handleFileUpload(e.target.files); e.target.value = ''; }}
                    className="hidden"
                  />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
                    isDragging ? 'bg-caffeine-gold text-white' : 'bg-white text-caffeine-gold border border-caffeine-cardBorder'
                  }`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-caffeine-cream">
                      {isDragging ? '📸 Relâchez pour ajouter les photos' : 'Glissez-déposez vos photos ici'}
                    </p>
                    <p className="text-[11px] text-caffeine-subtle mt-0.5">
                      ou <span className="text-caffeine-gold font-bold">cliquez pour parcourir</span> — JPG, PNG, WEBP
                    </p>
                  </div>
                </div>

                {/* ── Photo Grid ── */}
                {currentProductPhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentProductPhotos.map((photo, idx) => {
                      const isMain = photo === editingProduct.imageUrl;
                      const isBase64 = photo.startsWith('data:');
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 group bg-white cursor-pointer transition-all ${
                            isMain
                              ? 'border-caffeine-gold shadow-gold-sm'
                              : 'border-caffeine-cardBorder hover:border-caffeine-gold/50 shadow-sm'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Badges */}
                          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                            {isMain && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-caffeine-gold text-white shadow flex items-center gap-1">
                                <Star className="w-2.5 h-2.5" /> Couverture
                              </span>
                            )}
                            {isBase64 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-amber-600 text-white shadow">
                                Local
                              </span>
                            )}
                          </div>

                          {/* Hover Actions Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end gap-1.5 p-2">
                            {!isMain && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleSetPrimaryPhoto(photo); }}
                                className="py-1.5 rounded-xl bg-caffeine-gold text-white font-black text-[10px] hover:bg-yellow-500 transition-colors w-full flex items-center justify-center gap-1 shadow"
                              >
                                <Crown className="w-3 h-3" /> Définir Couverture
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo); }}
                              className="py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition-colors flex items-center justify-center gap-1 w-full shadow"
                            >
                              <Trash className="w-3 h-3" /> Supprimer
                            </button>
                          </div>

                          {/* Lightbox preview trigger */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPreviewPhoto(photo); }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Add More tile */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-caffeine-cardBorder hover:border-caffeine-gold/50 bg-white flex flex-col items-center justify-center gap-2 text-caffeine-subtle hover:text-caffeine-gold transition-all shadow-sm"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-[10px] font-bold">Ajouter</span>
                    </button>
                  </div>
                )}

                {/* ── URL Input ── */}
                <div className="flex gap-2 pt-2 border-t border-caffeine-cardBorder/60">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-caffeine-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Ou coller l'URL d'une photo (https://...)" 
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-caffeine-cardBorder text-xs text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold shadow-sm transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl.trim()}
                    className="px-4 py-2.5 rounded-xl bg-caffeine-gold text-white font-black text-xs hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter URL
                  </button>
                </div>

              </div>

              {/* ------------------------------------------------------------- */}
              {/* SECTION INFORMATIONS GÉNÉRALES & PRIX (FCFA) */}
              {/* ------------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Nom du Gâteau *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ex : Forêt Noire Prestige & Griottes"
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Slogan Accrocheur (Tagline) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.tagline || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="Ex : Mousse chocolat Guanaja, chantilly mascarpone et griottes"
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Prix Normal (FCFA) *</label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={editingProduct.price || 30000}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Prix Promo Réduit (FCFA)</label>
                  <input
                    type="number"
                    step="500"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Optionnel (ex: 25000)"
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Catégorie *</label>
                  <select
                    value={editingProduct.category || 'anniversaire'}
                    onChange={(e) => {
                      const catSlug = e.target.value as ProductCategory;
                      const catName = CATEGORIES.find(c => c.slug === catSlug)?.name || 'Gâteaux d\'Anniversaire';
                      setEditingProduct({ ...editingProduct, category: catSlug, categoryName: catName });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Stock Disponible *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">Description Détaillée</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                </div>

                {/* Flags */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-caffeine-cream">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isPromotion)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isPromotion: e.target.checked })}
                      className="accent-caffeine-gold"
                    />
                    <span>En Promotion (-%)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-caffeine-cream">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isPopular)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isPopular: e.target.checked })}
                      className="accent-caffeine-gold"
                    />
                    <span>Populaire / Best-seller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-caffeine-cream">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isNew)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                      className="accent-caffeine-gold"
                    />
                    <span>Nouvelle Création</span>
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-caffeine-cardBorder flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[11px] text-caffeine-subtle">
                  {currentProductPhotos.length} photo(s) · Visible sur le site public après sauvegarde.
                </span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProduct(null);
                      setSizeWarning(false);
                    }}
                    className="btn-caffeine-secondary text-xs !py-3 !px-6 flex-1 sm:flex-none shadow-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-caffeine-primary text-xs !py-3 !px-8 flex items-center justify-center gap-2 shadow-gold-sm flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer &amp; Publier</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Lightbox: Full-size Photo Preview ── */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewPhoto}
              alt="Aperçu photo"
              className="w-full h-full object-contain rounded-3xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-caffeine-card border border-caffeine-cardBorder text-caffeine-cream hover:text-caffeine-gold flex items-center justify-center shadow-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Toast: Photos Saved ── */}
      {photoSaved && (
        <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-4 rounded-2xl bg-green-600 text-white shadow-2xl border border-green-500/50 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Photos publiées sur le site !</p>
            <p className="text-xs opacity-85">Les visiteurs voient maintenant les nouvelles photos.</p>
          </div>
        </div>
      )}

    </div>
  );
}
