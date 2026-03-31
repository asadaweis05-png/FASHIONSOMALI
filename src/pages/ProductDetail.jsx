import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Sparkles, Star, ArrowRight } from 'lucide-react';
import { products } from '../data/mockData';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  const [selectedSize, setSelectedSize] = useState('S');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="product-detail-page container">
      <div className="product-main">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="thumbnails">
            <img src={product.image} alt="Thumb 1" className="thumb active" />
            <img src="https://images.unsplash.com/photo-1594131557088-e2187b646c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Thumb 2" className="thumb" />
            <img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Thumb 3" className="thumb" />
          </div>
          <div className="main-image-wrap">
            <img src={product.image} alt={product.name} className="main-image" />
          </div>
        </div>

        {/* Details */}
        <div className="product-info-section">
          <span className="eyebrow">{product.collection || 'ARTISANAL HERITAGE'}</span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-reviews-row">
            <div className="stars">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
            </div>
            <span className="review-text">48 Fikradood</span>
            <span className="meta-separator">|</span>
            <span className="badge-pill highlight">Xadidan</span>
          </div>

          <div className="product-price-section">
            <span className="product-price">${product.price.toFixed(2)}</span>
          </div>

          <div className="product-narrative">
            <h3>FAAHFAAHIN</h3>
            <p>
              Dharkan waxaa loogu talagalay qof doonaya muuqaal nadiif ah oo casri ah. 
              Waa mid raaxo leh, fududna in la xirto, kuna habboon maalmo kala duwan. 
              Wuxuu isku daraa bilicda soo jireenka ah iyo qaabka casriga ah.
            </p>
          </div>

          <div className="size-selector">
            <div className="selector-header">
              <h3>DOORO CABIRKAAGA</h3>
              <button className="size-guide">Tilmaamaha Cabirka</button>
            </div>
            <div className="size-options">
              {['XS', 'S', 'M', 'L'].map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="add-to-cart-actions" style={{ marginTop: '1rem' }}>
            <Link to="/cart" className="btn-primary" style={{ flex: 2 }}>
              Ku dar gaariga — ${product.price.toFixed(2)}
            </Link>
            <button className="btn-outline save-btn" style={{ flex: 1 }}>
              <Heart size={16} /> Kaydi
            </button>
          </div>
          <button className="btn-outline" style={{width: '100%', marginTop: '1rem', background: '#0c3b5e', color: '#fff', border: 'none'}}>Iibso hadda</button>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="ai-recs-section section-padding">
        <div className="ai-recs-header">
          <div className="ai-recs-title-wrap">
            <span className="eyebrow ai-glow">
              <Sparkles size={14} /> TALOOYINKA AI STYLIST
            </span>
            <h2 className="title-large" style={{fontSize: '2.5rem', marginTop: '0.5rem'}}>Ku dhamaystir billicdaada</h2>
            <p style={{maxWidth: '500px', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
              Noo sheeg munaasabadda ama waxa aad rabto, waxaan kuu soo jeedin doonaa xulashooyin waxyaabahan hoose ah oo si fiican ula socda dharkaaga.
            </p>
          </div>
          <Link to="/ai-stylist" className="personalize-link">TIJAABI AI STYLIST <ArrowRight size={16} /></Link>
        </div>

        <div className="rec-grid">
          <div className="rec-item">
             <div className="rec-image-wrap">
               <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Jewelry" />
               <span className="badge-pill highlight overlay-badge">IS LEH</span>
             </div>
             <div className="rec-category">DAHABCA / QURXIN</div>
             <div className="rec-title">Zeyla Filigree Gold Set</div>
             <div className="rec-meta">
               <strong>$890</strong>
             </div>
          </div>

          <div className="rec-item">
             <div className="rec-image-wrap">
               <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Footwear" />
             </div>
             <div className="rec-category">KUBO</div>
             <div className="rec-title">Coastal Nomad Sandal</div>
             <div className="rec-meta">
               <strong>$420</strong>
             </div>
          </div>

          <div className="rec-item">
             <div className="rec-image-wrap">
               <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Bags" />
             </div>
             <div className="rec-category">BOORSO</div>
             <div className="rec-title">Banadir Woven Tote</div>
             <div className="rec-meta">
               <strong>$650</strong>
             </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section section-padding">
        <h2 className="title-large" style={{fontSize: '2rem', marginBottom: '3rem'}}>Fikradaha Macaamiisha</h2>
        
        <div className="review-list">
          <div className="review-item">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf08c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="User" className="review-avatar" />
            <div className="review-content">
              <div className="review-header">
                <div>
                  <h4>Amina R.</h4>
                  <span className="review-meta">MACAAMIIL XAQIIQ AH • MUQDISHO</span>
                </div>
              </div>
              <p className="review-quote">
                "Waa dhar qurux badan oo aad u raaxo leh. Runtii waan ka helay sida uu iila ekaa. Talo bixinta AI-ga waxay iga caawisay inaan helo wax is-leh."
              </p>
            </div>
          </div>

          <div className="review-item">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="User" className="review-avatar" />
            <div className="review-content">
              <div className="review-header">
                <div>
                  <h4>Idris K.</h4>
                  <span className="review-meta">MACAAMIIL XAQIIQ AH • LONDON</span>
                </div>
              </div>
              <p className="review-quote">
                "Waa shaqo aad u wanaagsan. Waad ku mahadsantihiin sida fudud ee waxa aan rabay aan u helay adigoon meel tagin."
              </p>
            </div>
          </div>
        </div>

        <div className="review-action" style={{textAlign: 'center', marginTop: '3rem'}}>
          <button className="badge-pill outline-pill" style={{margin: '0 auto'}}>FIIRI DHAMMAAN FIKRADAHA</button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
