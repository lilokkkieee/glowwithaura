import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getGiftProducts, getProductsArray } from '@/data/products';

export default function Gift() {
  const giftProducts = getGiftProducts();
  const list = giftProducts.length >= 4 ? giftProducts : getProductsArray().slice(0, 6);
  return (
    <ProductGrid
      products={list}
      eyebrow="The Art of Gifting"
      title="Gift Sets"
      banner={
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Gift' }]} />
      }
    />
  );
}
