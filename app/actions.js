'use server'
import axios from 'axios';
import Papa from 'papaparse';

const BASE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1p8RBj2R1_5YoQuuxM8uUJT079VYwnrWjacgritMSu9Y/export?format=csv';

export async function fetchProductsAction(gid, page = 1, limit = 50, query = '') {
  try {
    const fetchUrl = gid ? `${BASE_SHEET_URL}&gid=${gid}` : BASE_SHEET_URL;
    const response = await axios.get(fetchUrl);
    const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });
    
    let products = parsedData.data;
    products = products.filter(p => p.picture_url && p.product_name && p.picture_url.startsWith('http'));
    
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(p => p.product_name.toLowerCase().includes(q));
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const maxItems = Math.min(200, products.length); // limit to 200 max as per requirement
    
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
