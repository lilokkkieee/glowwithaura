import type { Product, Category } from '@/types';
import { supabase } from '@/lib/supabase';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Jar Candle', slug: 'jar candle', description: 'Our iconic fragrances, crafted to define your space.', image: '' },
  { id: 'cat-2', name: 'Jel Candle', slug: 'jel candle', description: 'Garden-fresh scents inspired by nature.', image: '' },
  { id: 'cat-3', name: 'Pillar Candle', slug: 'pillar candle', description: 'Deep, warm, and grounding forest notes.', image: '' },
  { id: 'cat-4', name: 'Diwali Candle ', slug: 'diwali candle ', description: 'Limited editions for the moments that matter.', image: '' },
  { id: 'cat-5', name: 'Soy Candles', slug: 'soy candles', description: 'limited editions for the great moments ', image: '' },
  { id: 'cat-6', name: 'Occasional', slug: 'occasional', description: 'limited editions for the good moments ', image: '' },
];

let productsData: Product[] = [];
let loaded = false;
const listeners: Array<() => void> = [];

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) ?? '',
    longDescription: (row.long_description as string) ?? '',
    price: Number(row.price) || 0,
    discountPrice: row.discount_price != null ? Number(row.discount_price) : undefined,
    discountPercent: row.discount_percent != null ? Number(row.discount_percent) : undefined,
    rating: Number(row.rating) || 0,
    reviewCount: Number(row.review_count) || 0,
    stock: Number(row.stock) || 0,
    category: (row.category as string) ?? '',
    fragrance: (row.fragrance as string) ?? '',
    burnTime: (row.burn_time as string) ?? '',
    weight: (row.weight as string) ?? '',
    ingredients: (row.ingredients as string[]) ?? [],
    sku: (row.sku as string) ?? '',
    images: (row.images as string[]) ?? [],
    isBestSeller: Boolean(row.is_best_seller),
    isFeatured: Boolean(row.is_featured),
    isOnSale: Boolean(row.is_on_sale),
    isGiftPick: Boolean(row.is_gift_pick),
    isNew: Boolean(row.is_new),
  };
}

export async function loadProducts(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    if (data) {
      productsData = data.map(mapRow);
      listeners.forEach((fn) => fn());
    }
  } catch {
    loaded = false;
  }
}

export function getProducts(): Product[] {
  return productsData;
}

export function subscribeToProducts(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export function getProductsArray(): Product[] {
  return productsData;
}

export const getProductBySlug = (slug: string) => productsData.find((p) => p.slug === slug);
export const getProductById = (id: string) => productsData.find((p) => p.id === id);
export const getRelatedProducts = (product: Product, count = 4) =>
  productsData.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
export const getBestSellers = () => productsData.filter((p) => p.isBestSeller);
export const getFeaturedProducts = () => productsData.filter((p) => p.isFeatured);
export const getSaleProducts = () => productsData.filter((p) => p.isOnSale);
export const getGiftProducts = () => productsData.filter((p) => p.isGiftPick);
export const getNewProducts = () => productsData.filter((p) => p.isNew);
