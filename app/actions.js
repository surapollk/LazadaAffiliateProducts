'use server'
import axios from 'axios';
import Papa from 'papaparse';

const BASE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1p8RBj2R1_5YoQuuxM8uUJT079VYwnrWjacgritMSu9Y/export?format=csv';
const SHEET_HTML_URL = 'https://docs.google.com/spreadsheets/d/1p8RBj2R1_5YoQuuxM8uUJT079VYwnrWjacgritMSu9Y/htmlview';

export async function getCategories() {
  try {
    const response = await axios.get(SHEET_HTML_URL);
    const html = response.data;
    const flatCategories = [];
    const regex = /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:.*?gid=([0-9]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      flatCategories.push({ name: match[1].trim(), gid: match[2] });
    }

    const categoriesMap = {};
    flatCategories.forEach(cat => {
      if (cat.name.includes('-')) {
        const parts = cat.name.split('-');
        const mainName = parts[0].trim();
        const subName = parts.slice(1).join('-').trim();
        if (!categoriesMap[mainName]) {
          categoriesMap[mainName] = { name: mainName, gid: null, subCategories: [] };
        }
        categoriesMap[mainName].subCategories.push({ name: subName, gid: cat.gid });
      } else {
        const mainName = cat.name;
        if (!categoriesMap[mainName]) {
          categoriesMap[mainName] = { name: mainName, gid: cat.gid, subCategories: [] };
        } else {
          categoriesMap[mainName].gid = cat.gid;
        }
      }
    });
    return Object.values(categoriesMap);
  } catch (err) {
    console.error("Failed to fetch categories", err);
    return [];
  }
}

export async function fetchProductsAction(gid, page = 1, limit = 50, query = '') {
  try {
    let allProducts = [];
    const categories = await getCategories();
    const flatCategoriesList = [];
    categories.forEach(c => {
      if (c.gid) flatCategoriesList.push({ name: c.name, gid: c.gid });
      if (c.subCategories) {
        c.subCategories.forEach(s => flatCategoriesList.push({ name: s.name, gid: s.gid }));
      }
    });
    
    if (gid) {
      const fetchUrl = `${BASE_SHEET_URL}&gid=${gid}`;
      const response = await axios.get(fetchUrl);
      const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });
      const catName = flatCategoriesList.find(c => c.gid === gid)?.name || '';
      allProducts = parsedData.data.map(p => ({ ...p, _category_name: catName }));
    } else {
      // Global search: fetch from all categories in parallel
      const allGids = flatCategoriesList.map(c => c.gid);
      const promises = allGids.map(g => axios.get(`${BASE_SHEET_URL}&gid=${g}`));
      const responses = await Promise.all(promises);
      
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const catName = flatCategoriesList[i].name;
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });
        const productsWithCat = parsedData.data.map(p => ({ ...p, _category_name: catName }));
        allProducts = [...allProducts, ...productsWithCat];
      }
    }
    
    let products = allProducts.filter(p => p.picture_url && p.product_name && p.picture_url.startsWith('http'));
    
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(p => {
        const pName = (p.product_name || '').toLowerCase();
        const cName = (p._category_name || '').toLowerCase();
        return pName.includes(q) || cName.includes(q);
      });
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const maxItems = Math.min(1000, products.length); // increased limit for global search
    
    const paginatedProducts = products.slice(startIndex, Math.min(endIndex, maxItems));
    const hasMore = endIndex < maxItems;
    
    return {
      products: paginatedProducts,
      hasMore
    };
  } catch (err) {
    console.error("Failed to fetch products", err);
    return { products: [], hasMore: false };
  }
}
