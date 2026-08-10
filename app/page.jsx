import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { fetchProductsAction } from './actions';

const SHEET_HTML_URL = 'https://docs.google.com/spreadsheets/d/1p8RBj2R1_5YoQuuxM8uUJT079VYwnrWjacgritMSu9Y/htmlview';

async function getCategories() {
  try {
    const response = await axios.get(SHEET_HTML_URL);
    const html = response.data;
    const categories = [];
    const regex = /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:.*?gid=([0-9]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      categories.push({ name: match[1], gid: match[2] });
    }
    return categories;
  } catch (err) {
    console.error("Failed to fetch categories", err);
    return [];
  }
}

export async function generateMetadata({ searchParams }) {
  const categories = await getCategories();
  const activeGid = searchParams.gid || (categories[0]?.gid || '');
  const activeCategory = categories.find(c => c.gid === activeGid);
  const categoryName = activeCategory ? activeCategory.name : 'สินค้าแนะนำ';

  return {
    title: `${categoryName} | Lazada Affiliate Mall`,
    description: `เลือกช้อป ${categoryName} สินค้าคุณภาพดี ราคาโปรโมชั่นพิเศษ`,
    keywords: [categoryName, 'Lazada', 'ส่วนลด', 'ราคาถูก', 'โปรโมชั่น']
  }
}

export default async function Page({ searchParams }) {
  const categories = await getCategories();
  const activeGid = searchParams.gid || (categories[0]?.gid || '');
  
  // Fetch initial products server-side
  const { products: initialProducts, hasMore: initialHasMore } = await fetchProductsAction(activeGid, 1, 50);
  
  const activeCategory = categories.find(c => c.gid === activeGid);
  const categoryName = activeCategory ? activeCategory.name : 'สินค้าแนะนำ';

  return (
    <div className="app-wrapper">
      <Header categories={categories} activeGid={activeGid} />
      
      <main className="main-container">
        <h2 className="section-title">{categoryName}</h2>
        <ProductList 
          initialProducts={initialProducts} 
          initialHasMore={initialHasMore} 
          gid={activeGid} 
        />
      </main>

      <Footer categories={categories} />
    </div>
  );
}
