import React from 'react';

const ProductCard = ({ product }) => {
  // Use discounted price if available, else use sale price
  const price = parseFloat(product.discounted_price) || parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.sale_price);
  const discount = product.discounted_percentage;
  
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.picture_url} 
          alt={product.product_name} 
          className="product-image" 
          loading="lazy" 
        />
      </div>
      <div className="product-info">
        <h3 className="product-title" title={product.product_name}>
          {product.product_name}
        </h3>
        
        <div className="product-price-container">
          <span className="price-current">฿{price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
          {originalPrice > price && (
            <>
              <span className="price-original">฿{originalPrice.toLocaleString('th-TH')}</span>
              {discount && discount !== 'N/A' && discount !== '-0%' && (
                <span className="discount-badge">{discount}</span>
              )}
            </>
          )}
        </div>
        
        <a 
          href={product.promo_short_link || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-details"
          style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
        >
          ดูรายละเอียด
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
