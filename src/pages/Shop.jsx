import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Palette, ChevronDown, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';
import './Shop.css';

const categories = ['Dhammaan', 'Dirac', 'Khamiis', 'Casual', 'Dharka xafladaha'];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Dhammaan';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'Dhammaan' || 
                            product.category === activeCategory || 
                            (activeCategory === 'Dharka xafladaha' && product.category === 'Dresses') ||
                            (activeCategory === 'Casual' && product.category === 'Outerwear');
                            
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop-page container">
      <div className="shop-header" style={{ marginBottom: '2rem' }}>
        <div className="shop-header-content">
          <span className="eyebrow ai-glow">DOORASHO SAHLAN, MUUQAAL FIICAN</span>
          <h1 className="title-large" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Dukaanka</h1>
        </div>
        
        <div className="search-bar-wrap" style={{ maxWidth: '450px', width: '100%', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Raadi dhar ama style aad jeceshahay..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1.25rem 0.85rem 3rem', borderRadius: '40px', border: '1.5px solid var(--border-color)', outline: 'none', background: 'white', transition: 'border-color 0.3s ease', fontSize: '0.95rem' }}
          />
        </div>
      </div>

      <div className="shop-controls">
        <div className="shop-filters">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`badge-pill filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button className="badge-pill filter-pill icon-filter">
             <Palette size={14} /> Midabada
          </button>
        </div>

        <div className="shop-sort">
          <span>Kala sooc: Kuwa cusub</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="shop-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="shop-pagination">
        <button className="page-nav disabled">Dib</button>
        <button className="page-num active">1</button>
        <button className="page-num">2</button>
        <button className="page-num">3</button>
        <span className="page-dots">...</span>
        <button className="page-num">12</button>
        <button className="page-nav">Hore &rarr;</button>
      </div>
    </div>
  );
};

export default Shop;
