import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        {product.badges && product.badges.length > 0 && (
          <div className="product-badges">
            {product.badges.map((badge, i) => (
              <span key={i} className={`card-badge ${badge.includes('Match') || badge.includes('Best') ? 'highlight' : ''}`}>
                {badge.includes('Match') || badge.includes('Best') ? <Sparkles size={10} style={{marginRight: '3px'}}/> : ''}
                {badge}
              </span>
            ))}
          </div>
        )}
      </Link>
      <div className="product-info">
        <div className="product-info-top">
          <h3 className="product-name">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <span className="product-price">${product.price}</span>
        </div>
        {product.collection && (
          <span className="product-collection">{product.collection}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
