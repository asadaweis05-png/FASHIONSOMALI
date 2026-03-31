import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Package, MapPin, CreditCard, LogOut, Heart, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const userId = session.user.id;
        setOrders(JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]'));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const userId = session.user.id;
        setOrders(JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]'));
      } else {
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthError('Fadlan hubi iimaylkaaga si aad u xaqiijiso akoonkaaga.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="container section-padding" style={{textAlign: 'center'}}>Waa la soo dhigayaa...</div>;
  }

  if (!session) {
    return (
      <div className="auth-page container section-padding" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 className="title-large" style={{textAlign: 'center', marginBottom: '2rem'}}>
          {isSignUp ? 'Is Diwaangeli' : 'Ku soo dhawoow'}
        </h2>
        
        {authError && <div style={{padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem'}}>{authError}</div>}
        
        <form className="auth-form" onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="form-group">
            <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Iimayl</label>
            <input type="email" required placeholder="name@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px'}} />
          </div>
          
          <div className="form-group">
            <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Furaha sirta ah</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px'}} />
          </div>
          
          <button type="submit" className="btn-primary" style={{marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Waa la baarayaa...' : (isSignUp ? 'Is Diwaangeli' : 'Gal')}
          </button>
          
          <div className="auth-links" style={{textAlign: 'center', marginTop: '1rem'}}>
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'underline'}}>
              {isSignUp ? 'Horey ayaan akoon u lahaa (Gal)' : 'Akoon malihi (Is diwaangeli)'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const userEmail = session.user.email;
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="profile-page container section-padding">
      <div className="profile-layout" style={{display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '3rem'}}>
        
        <aside className="profile-sidebar">
          <div className="profile-user-info" style={{marginBottom: '2rem'}}>
            <div style={{width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem'}}>
              {initial}
            </div>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{userEmail}</p>
          </div>

          <nav className="profile-nav" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <button className="profile-nav-btn active" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'var(--pill-bg)', color: 'var(--primary-color)', textAlign: 'left', fontWeight: '500'}}>
              <Package size={18} /> Dalabyadayda
            </button>
            <Link to="/rewards" className="profile-nav-btn" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-main)', textAlign: 'left', textDecoration: 'none'}}>
              <Gift size={18} color="var(--primary-color)" /> Linkigayga (Abaalgud)
            </Link>
            <button className="profile-nav-btn text-danger" onClick={handleSignOut} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444', textAlign: 'left', marginTop: '2rem'}}>
              <LogOut size={18} /> Ka bax
            </button>
          </nav>
        </aside>

        <main className="profile-content">
          <h1 className="title-large" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Akoonkayga</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Tirada dalabyada aad samaysay: <strong>{orders.length}</strong></p>
          
          <div className="orders-list" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {orders.length === 0 ? (
              <p style={{padding: '2rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', color: 'var(--text-muted)'}}>
                Weli wax dalab ah maadan samayn.
              </p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-card" style={{border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#fff'}}>
                  <div className="order-header" style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem'}}>
                    <div>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Dalabka #{order.id}</span>
                      <p style={{fontWeight: '500'}}>{order.date}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <span className="badge-pill" style={{backgroundColor: '#dcfce7', color: '#166534'}}>{order.status}</span>
                      <p style={{fontWeight: '600', marginTop: '0.5rem'}}>${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="order-items" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{display: 'flex', gap: '1rem'}}>
                        <img src={item.image} alt={item.name} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />
                        <div>
                          <h4 style={{fontFamily: 'var(--font-heading)', fontSize: '1rem'}}>{item.name}</h4>
                          <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Xaddiga: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            
          </div>
        </main>

      </div>
    </div>
  );
};

export default Profile;
