import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import { fetchProductsAction, getCategories } from './actions';

export async function generateMetadata({ searchParams }) {
  const categories = await getCategories();
  const searchQuery = searchParams.q || '';
  const isGlobalSearch = searchQuery && !searchParams.gid;
  
  const firstGid = categories.flatMap(c => [c.gid, ...(c.subCategories || []).map(s => s.gid)]).find(Boolean);
  const activeGid = isGlobalSearch ? '' : (searchParams.gid || firstGid || '');
  
  let activeCategory = null;
  for (const c of categories) {
    if (c.gid === activeGid) { activeCategory = c; break; }
    const sub = c.subCategories?.find(s => s.gid === activeGid);
    if (sub) { activeCategory = sub; break; }
  }
  
  let categoryName = activeCategory ? activeCategory.name : 'สินค้าแนะนำ';
  if (isGlobalSearch) {
    categoryName = `ค้นหาสินค้าทั้งหมด: "${searchQuery}"`;
  }

  return {
    title: `${categoryName} | Lazada Affiliate Mall`,
    description: `เลือกช้อป ${categoryName} สินค้าคุณภาพดี ราคาโปรโมชั่นพิเศษ`,
    keywords: [categoryName, 'Lazada', 'ส่วนลด', 'ราคาถูก', 'โปรโมชั่น']
  }
}

export default async function Page({ searchParams }) {
  const categories = await getCategories();
  const searchQuery = searchParams.q || '';
  
  // If user is searching and didn't specify a category, do a global search
  const isGlobalSearch = searchQuery && !searchParams.gid;
  
  const firstGid = categories.flatMap(c => [c.gid, ...(c.subCategories || []).map(s => s.gid)]).find(Boolean);
  const activeGid = isGlobalSearch ? '' : (searchParams.gid || firstGid || '');
  
  // Fetch initial products server-side
  const { products: initialProducts, hasMore: initialHasMore } = await fetchProductsAction(activeGid, 1, 50, searchQuery);
  
  let activeCategory = null;
  for (const c of categories) {
    if (c.gid === activeGid) { activeCategory = c; break; }
    const sub = c.subCategories?.find(s => s.gid === activeGid);
    if (sub) { activeCategory = sub; break; }
  }
  
  let categoryName = activeCategory ? activeCategory.name : 'สินค้าแนะนำ';
  
  if (searchQuery) {
    if (isGlobalSearch) {
      categoryName = `ผลการค้นหา "${searchQuery}" จากทุกหมวดหมู่`;
    } else {
      categoryName = `ผลการค้นหา "${searchQuery}" ใน ${categoryName}`;
    }
  }

  return (
    <div className="app-wrapper">
      <Header categories={categories} activeGid={activeGid} initialQuery={searchQuery} />
      
      <main className="main-container">
        <h2 className="section-title">{categoryName}</h2>
        
        {initialProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem' }}>
            ไม่พบสินค้าที่ตรงกับการค้นหา
          </div>
        ) : (
          <ProductList 
            initialProducts={initialProducts} 
            initialHasMore={initialHasMore} 
            gid={activeGid} 
            query={searchQuery}
          />
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
