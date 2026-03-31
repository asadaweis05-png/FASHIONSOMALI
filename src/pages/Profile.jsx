import React, { useState } from 'react';
import { Package, MapPin, CreditCard, LogOut, Heart } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state

  if (!isLoggedIn) {
    return (
      <div className="auth-page container section-padding" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 className="title-large" style={{textAlign: 'center', marginBottom: '2rem'}}>Ku soo dhawoow</h2>
        
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="form-group">
            <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Iimayl</label>
            <input type="email" required placeholder="name@example.com" style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px'}} />
          </div>
          
          <div className="form-group">
            <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Furaha sirta ah</label>
            <input type="password" required placeholder="••••••••" style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px'}} />
          </div>
          
          <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>
            Gal
          </button>
          
          <div className="auth-links" style={{textAlign: 'center', marginTop: '1rem'}}>
            <a href="#" style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Is diwaangeli</a>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="profile-page container section-padding">
      <div className="profile-layout" style={{display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '3rem'}}>
        
        <aside className="profile-sidebar">
          <div className="profile-user-info" style={{marginBottom: '2rem'}}>
            <div style={{width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem'}}>
              AJ
            </div>
            <h2 style={{fontFamily: 'var(--font-heading)', fontSize: '1.25rem'}}>Amina Jama</h2>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>amina.j@example.com</p>
          </div>

          <nav className="profile-nav" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <button className="profile-nav-btn active" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'var(--pill-bg)', color: 'var(--primary-color)', textAlign: 'left', fontWeight: '500'}}>
              <Package size={18} /> Dalabyadayda
            </button>
            <button className="profile-nav-btn" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-muted)', textAlign: 'left'}}>
              <Heart size={18} /> Waxyaabaha aan kaydiyay
            </button>
            <button className="profile-nav-btn" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-muted)', textAlign: 'left'}}>
              <MapPin size={18} /> Macluumaadkayga
            </button>
            <button className="profile-nav-btn text-danger" onClick={() => setIsLoggedIn(false)} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444', textAlign: 'left', marginTop: '2rem'}}>
              <LogOut size={18} /> Ka bax
            </button>
          </nav>
        </aside>

        <main className="profile-content">
          <h1 className="title-large" style={{fontSize: '2rem', marginBottom: '2rem'}}>Akoonkayga</h1>
          
          <div className="orders-list" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Mock Order */}
            <div className="order-card" style={{border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#fff'}}>
              <div className="order-header" style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem'}}>
                <div>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Dalabka #49281</span>
                  <p style={{fontWeight: '500'}}>Luulyo 12, 2026</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <span className="badge-pill" style={{backgroundColor: '#dcfce7', color: '#166534'}}>La dhiibay</span>
                  <p style={{fontWeight: '600', marginTop: '0.5rem'}}>$340.00</p>
                </div>
              </div>
              
              <div className="order-items" style={{display: 'flex', gap: '1rem'}}>
                <img src="https://images.unsplash.com/photo-1621251343750-622cd5342a78?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Item" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />
                <div>
                  <h4 style={{fontFamily: 'var(--font-heading)', fontSize: '1rem'}}>Azure Silk Guntiino</h4>
                  <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Xaddiga: 1</p>
                </div>
              </div>
            </div>
            
          </div>
        </main>

      </div>
    </div>
  );
};

export default Profile;
