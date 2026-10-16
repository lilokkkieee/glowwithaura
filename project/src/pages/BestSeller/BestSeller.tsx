import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getBestSellers } from '@/data/products';

export default function BestSeller() {
  return (
    <ProductGrid
      products={getBestSellers()}
      eyebrow="Customer Favourites"
      title="Best Sellers"
      banner={
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Best Sellers' }]} />
      }
    />
  );
}
