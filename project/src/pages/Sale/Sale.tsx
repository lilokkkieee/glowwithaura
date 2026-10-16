import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getSaleProducts } from '@/data/products';

export default function Sale() {
  return (
    <ProductGrid
      products={getSaleProducts()}
      eyebrow="Limited Time"
      title="On Sale"
      banner={
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Sale' }]} />
      }
    />
  );
}
