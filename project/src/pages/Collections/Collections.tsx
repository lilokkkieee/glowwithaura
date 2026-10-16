import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getProductsArray } from '@/data/products';

export default function Collections() {
  return (
    <ProductGrid
      products={getProductsArray()}
      eyebrow="All Candles"
      title="Collections"
      banner={
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
      }
    />
  );
}
