import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';
import './Home.css';

const Home = () => {
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow ai-glow">STYLE-KAAGA, SI FUDUD U HEL</span>
          <h1 className="title-large" style={{color: '#fff', margin: '1rem 0'}}>
            Dharkaaga si kalsooni leh u dooro
          </h1>
          <p style={{color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem', marginBottom: '2.5rem', fontWeight: 300}}>
            Halkan waxaad ka heleysaa dhar casri ah iyo kuwo dhaqameed oo si fudud laguu soo gaarsiinayo.
          </p>
          <Link to="/shop" className="btn-primary" style={{display: 'inline-flex', width: 'auto', padding: '1rem 2.5rem', fontSize: '1.05rem'}}>
            Dukaameyso hadda <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Delivery Highlights */}
      <section className="delivery-banner">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--pill-bg)', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <Truck size={24} />
          </div>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>Gaarsiin degdeg ah oo lagu kalsoonaan karo</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
            Dalabkaaga si dhaqso leh ayaan kuugu soo gaarsiinaynaa. Gudaha Muqdisho — isla maalintaas. Gobollada kale — sida ugu dhaqsaha badan.
          </p>
        </div>
      </section>

      <section className="container section-padding">
        {/* Featured Categories */}
        <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 className="title-large" style={{fontSize: '2rem'}}>Dooro waxa kugu habboon</h2>
        </div>
        
        <div className="categories-grid" style={{ marginBottom: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Dirac', 'Khamiis', 'Casual', 'Dharka xafladaha'].map((cat, index) => (
            <Link to={`/shop?category=${cat}`} key={index} className="badge-pill outline-pill" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Trending Products */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="title-large" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Kuwa hadda la jecel yahay</h2>
          <p style={{color: 'var(--text-muted)'}}>Fiiri dharka ay dadka kale dooranayaan — kuwa ugu cusub uguna caansan hadda.</p>
        </div>
        
        <div className="shop-grid">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div style={{textAlign: 'center', marginTop: '3rem'}}>
           <Link to="/shop" className="btn-outline" style={{display: 'inline-flex', width: 'auto'}}>Fiiri Dhammaan</Link>
        </div>
      </section>

      {/* AI CTA Section */}
      <section className="ai-cta-section container section-padding" style={{paddingTop: '0'}}>
        <div className="ai-cta-box">
          <div className="ai-cta-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#fdf5d3', padding: '1rem', borderRadius: '50%', color: '#8c6b12' }}>
                <Sparkles size={28} />
              </div>
            </div>
            <h2 className="title-large" style={{fontSize: '2.25rem', marginBottom: '1rem'}}>Ma hubtaa style-kaaga?</h2>
            <p style={{color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem'}}>
              Mararka qaar waa adag tahay in la doorto dharka saxda ah. Noo sheeg munaasabadda ama waxa aad rabto, waxaan kuu soo jeedin doonaa xulashooyin si fiican kuugu habboon.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/ai-stylist" className="btn-primary" style={{display: 'inline-flex', width: 'auto'}}>
                Tijaabi AI Stylist <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
