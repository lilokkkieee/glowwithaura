import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import QuickView from '@/components/QuickView/QuickView';
import { categories } from '@/data/products';

interface ProductGridProps {
  products: Product[];
  title: string;
  eyebrow?: string;
  banner?: React.ReactNode;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const PAGE_SIZE = 8;

export default function ProductGrid({ products, title, eyebrow, banner }: ProductGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const activeCategory = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';
  const [sort, setSort] = useState<SortKey>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      const catName = categories.find((c) => c.slug === activeCategory)?.name;
      if (catName) result = result.filter((p) => p.category === catName);
    }

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fragrance.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, activeCategory, query, sort, priceRange]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > page * PAGE_SIZE;

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="container-luxury py-10 lg:py-14">
      {banner}

      <div className="mb-8">
        {eyebrow && <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">{eyebrow}</span>}
        <h1 className="font-serif text-4xl md:text-5xl text-cream-100">{title}</h1>
        {query && (
          <p className="mt-2 text-cream-300/80">
            Showing results for “<span className="text-gold-400 font-medium">{query}</span>”
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-forest-800 border border-forest-700 mb-4"
          >
            <span className="flex items-center gap-2 font-medium text-cream-100">
              <SlidersHorizontal size={18} /> Filters
            </span>
            <ChevronDown size={18} className={`text-cream-200 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-8`}>
            <div>
              <h3 className="font-serif text-lg text-cream-100 mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCategory('all')}
                    className={`text-sm transition-colors ${activeCategory === 'all' ? 'text-gold-400 font-medium' : 'text-cream-300 hover:text-cream-100'}`}
                  >
                    All Candles
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setCategory(c.slug)}
                      className={`text-sm transition-colors ${activeCategory === c.slug ? 'text-gold-400 font-medium' : 'text-cream-300 hover:text-cream-100'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg text-cream-100 mb-3">Price Range</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-cream-300">₹{priceRange[0]}</span>
                <span className="text-cream-400">—</span>
                <span className="text-sm text-cream-300">₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-gold-500"
              />
            </div>

            {(activeCategory !== 'all' || query) && (
              <button
                onClick={() => { setSearchParams({}); setPriceRange([0, 100]); }}
                className="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-cream-300/80">
              {filtered.length} {filtered.length === 1 ? 'candle' : 'candles'}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-cream-300/80 hidden sm:block">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="px-4 py-2 rounded-full bg-forest-800 border border-forest-700 text-sm text-cream-100 focus:outline-none focus:border-gold-400 cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-cream-100 mb-2">No candles found</p>
              <p className="text-cream-300/80">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginated.map((product, i) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickView} index={i} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <button onClick={() => setPage(page + 1)} className="btn-gold">
                    Load More ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
