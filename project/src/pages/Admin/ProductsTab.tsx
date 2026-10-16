import { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price: number;
  discount_price: number | null;
  discount_percent: number | null;
  rating: number;
  review_count: number;
  stock: number;
  in_stock: boolean;
  category: string;
  fragrance: string;
  burn_time: string;
  weight: string;
  ingredients: string[];
  sku: string;
  images: string[];
  is_best_seller: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  is_gift_pick: boolean;
  is_new: boolean;
  reviews: unknown[];
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    longDescription: row.long_description ?? '',
    price: Number(row.price),
    discountPrice: row.discount_price != null ? Number(row.discount_price) : undefined,
    discountPercent: row.discount_percent != null ? Number(row.discount_percent) : undefined,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    stock: Number(row.stock),
    category: row.category ?? '',
    fragrance: row.fragrance ?? '',
    burnTime: row.burn_time ?? '',
    weight: row.weight ?? '',
    ingredients: row.ingredients ?? [],
    sku: row.sku ?? '',
    images: row.images ?? [],
    isBestSeller: row.is_best_seller,
    isFeatured: row.is_featured,
    isOnSale: row.is_on_sale,
    isGiftPick: row.is_gift_pick,
    isNew: row.is_new,
  };
}

interface FormState {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price: string;
  discount_price: string;
  category: string;
  fragrance: string;
  burn_time: string;
  weight: string;
  sku: string;
  stock: string;
  in_stock: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  is_gift_pick: boolean;
  is_new: boolean;
  images: string[];
}

const emptyForm: FormState = {
  id: '', name: '', slug: '', description: '', long_description: '',
  price: '', discount_price: '', category: '', fragrance: '', burn_time: '',
  weight: '', sku: '', stock: '', in_stock: true,
  is_best_seller: false, is_featured: false, is_on_sale: false,
  is_gift_pick: false, is_new: false, images: [],
};

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export default function ProductsTab({ onRefresh }: { onRefresh?: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (error) { setFormError(error.message); }
    else if (data) { setProducts(data.map((r) => rowToProduct(r as unknown as ProductRow))); }
    setLoading(false);
  }, []);

  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(); }, [fetchProducts]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(false);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id, name: p.name, slug: p.slug, description: p.description,
      long_description: p.longDescription, price: String(p.price),
      discount_price: p.discountPrice != null ? String(p.discountPrice) : '',
      category: p.category, fragrance: p.fragrance, burn_time: p.burnTime,
      weight: p.weight, sku: p.sku, stock: String(p.stock), in_stock: p.stock > 0,
      is_best_seller: !!p.isBestSeller, is_featured: !!p.isFeatured,
      is_on_sale: !!p.isOnSale, is_gift_pick: !!p.isGiftPick, is_new: !!p.isNew,
      images: p.images,
    });
    setEditing(true);
    setFormError(null);
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError(null);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('product-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setForm((f) => ({ ...f, images: [...f.images, pub.publicUrl] }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const price = parseFloat(form.price);
      if (Number.isNaN(price) || price < 0) throw new Error('Invalid price');
      const stock = parseInt(form.stock, 10) || 0;
      const slug = form.slug || slugify(form.name);
      const discountPrice = form.discount_price ? parseFloat(form.discount_price) : null;
      const discountPercent = discountPrice != null && price > 0 ? Math.round(((price - discountPrice) / price) * 100) : null;

      const payload = {
        name: form.name,
        slug,
        description: form.description,
        long_description: form.long_description,
        price,
        discount_price: discountPrice,
        discount_percent: discountPercent,
        stock,
        in_stock: stock > 0,
        category: form.category,
        fragrance: form.fragrance,
        burn_time: form.burn_time,
        weight: form.weight,
        sku: form.sku,
        images: form.images,
        is_best_seller: form.is_best_seller,
        is_featured: form.is_featured,
        is_on_sale: form.is_on_sale,
        is_gift_pick: form.is_gift_pick,
        is_new: form.is_new,
      };

      if (editing) {
        const { error } = await supabase.from('products').update(payload).eq('id', form.id);
        if (error) throw error;
      } else {
        const newId = `p-${Date.now()}`;
        const { error } = await supabase.from('products').insert({ ...payload, id: newId, rating: 0, review_count: 0 });
        if (error) throw error;
      }
      setShowForm(false);
      await fetchProducts();
      onRefresh?.();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteId);
      if (error) throw error;
      setDeleteId(null);
      await fetchProducts();
      onRefresh?.();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-12 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gold-400" /></div>;
  }

  if (showForm) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-cream-100">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full hover:bg-forest-700 flex items-center justify-center transition-colors">
            <X size={18} className="text-cream-200" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Slug">
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <Field label="Description">
            <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Long Description">
            <textarea rows={3} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Price (₹)">
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Sale Price (optional)">
              <input type="number" step="0.01" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Stock">
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Category">
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Fragrance">
              <input value={form.fragrance} onChange={(e) => setForm({ ...form, fragrance: e.target.value })} className={inputCls} />
            </Field>
            <Field label="SKU">
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Burn Time">
              <input value={form.burn_time} onChange={(e) => setForm({ ...form, burn_time: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Weight">
              <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-4">
            <Toggle label="Best Seller" checked={form.is_best_seller} onChange={(v) => setForm({ ...form, is_best_seller: v })} />
            <Toggle label="Gift Pick" checked={form.is_gift_pick} onChange={(v) => setForm({ ...form, is_gift_pick: v })} />
            <Toggle label="On Sale" checked={form.is_on_sale} onChange={(v) => setForm({ ...form, is_on_sale: v })} />
            <Toggle label="Featured" checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
            <Toggle label="New" checked={form.is_new} onChange={(v) => setForm({ ...form, is_new: v })} />
            <Toggle label="In Stock" checked={form.in_stock} onChange={(v) => setForm({ ...form, in_stock: v })} />
          </div>
          <div>
            <label className="text-cream-300/60 text-xs uppercase tracking-wide block mb-2">Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-forest-600">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 w-5 h-5 bg-forest-900/80 rounded-bl flex items-center justify-center">
                    <X size={12} className="text-cream-100" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border border-dashed border-forest-600 flex items-center justify-center cursor-pointer hover:border-gold-400 transition-colors">
                {uploading ? <Loader2 size={18} className="animate-spin text-gold-400" /> : <Upload size={18} className="text-cream-300/40" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>
          {formError && <p className="text-red-400 text-sm">{formError}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition-colors text-sm disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <>{editing ? 'Update' : 'Add'} Product</>}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl bg-forest-700 text-cream-200 font-medium hover:bg-forest-600 transition-colors text-sm">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  if (deleteId) {
    const product = products.find((p) => p.id === deleteId);
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-forest-700/50 rounded-xl p-6 text-center max-w-md mx-auto">
          <h3 className="font-serif text-lg text-cream-100 mb-2">Delete product?</h3>
          <p className="text-cream-300/60 text-sm mb-1">Are you sure you want to delete</p>
          <p className="text-gold-400 font-medium mb-6">{product?.name ?? 'this product'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition-colors text-sm disabled:opacity-50">
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Delete</>}
            </button>
            <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl bg-forest-700 text-cream-200 font-medium hover:bg-forest-600 transition-colors text-sm">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-cream-300/40 text-sm mb-4">No products yet.</p>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition-colors text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-forest-700">
      <div className="p-4 flex justify-end">
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition-colors text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>
      {products.map((p) => (
        <div key={p.id} className="flex items-center gap-4 p-4 lg:p-5 hover:bg-forest-700/30 transition-colors">
          <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-cream-100 font-medium truncate">{p.name}</p>
            <p className="text-cream-300/50 text-sm">{p.category}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gold-400 font-semibold text-sm">
              {p.discountPrice != null ? `₹${p.discountPrice}` : `₹${p.price}`}
              {p.discountPrice != null && <span className="text-cream-300/40 text-xs line-through ml-1">₹{p.price}</span>}
            </p>
            <p className={`text-xs ${p.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => openEdit(p)} className="w-9 h-9 rounded-full hover:bg-forest-700 flex items-center justify-center transition-colors" aria-label="Edit">
              <Pencil size={16} className="text-cream-200" />
            </button>
            <button onClick={() => setDeleteId(p.id)} className="w-9 h-9 rounded-full hover:bg-forest-700 flex items-center justify-center transition-colors" aria-label="Delete">
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 rounded-xl bg-forest-700 border border-forest-600 text-cream-100 placeholder:text-cream-300/50 text-sm focus:outline-none focus:border-gold-400 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-cream-300/60 text-xs uppercase tracking-wide block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${checked ? 'bg-gold-500/15 text-gold-400' : 'bg-forest-700 text-cream-300/60'}`}>
      <span className={`w-4 h-4 rounded-full border-2 transition-colors ${checked ? 'border-gold-400 bg-gold-400' : 'border-forest-500'}`} />
      {label}
    </button>
  );
}
