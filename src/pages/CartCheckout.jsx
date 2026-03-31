import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { products } from '../data/mockData';
import { supabase } from '../services/supabaseClient';
import './CartCheckout.css';

const CartCheckout = () => {
  const [cartItems, setCartItems] = useState([
    { ...products[0], quantity: 1, selectedSize: 'M' },
    { ...products[3], quantity: 1, selectedSize: 'S' }
  ]);
  const [step, setStep] = useState(1); // 1 = Cart, 2 = Checkout, 3 = Success

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userId = session.user.id;
        const storedVisits = localStorage.getItem(`referral_visits_${userId}`) || '0';
        setDiscountPercent(Math.min(parseInt(storedVisits, 10) * 10, 100));
      }
    });
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'AURA10') {
      setIsCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Coupon-kaad gelisay sax maahan.');
    }
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 15;
  const subtotal = calculateSubtotal();
  const effectiveDiscountPercent = discountPercent + (isCouponApplied ? 10 : 0);
  const discountAmount = subtotal * (effectiveDiscountPercent / 100);
  const total = subtotal - discountAmount + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save to local storage for the user
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userId = session.user.id;
      const existingOrders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]');
      
      const newOrder = {
        id: Math.floor(Math.random() * 100000),
        date: new Date().toLocaleDateString('so-SO'),
        items: cartItems,
        total: total,
        status: 'La dhiibay' // Delivered / Processed
      };
      
      localStorage.setItem(`user_orders_${userId}`, JSON.stringify([newOrder, ...existingOrders]));

      // Save to GLOBAL orders for Admin
      const globalOrders = JSON.parse(localStorage.getItem('global_orders') || '[]');
      localStorage.setItem('global_orders', JSON.stringify([
        { ...newOrder, customer: session.user.email },
        ...globalOrders
      ]));
    }

    setStep(3); // Go to success
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="empty-cart-page container section-padding" style={{textAlign: 'center'}}>
        <h2 className="title-large" style={{marginBottom: '1rem'}}>Gaarigaaga</h2>
        <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Gaarigaagu waa eber, fadlan ku dar shay.</p>
        <Link to="/shop" className="btn-primary" style={{display: 'inline-flex', width: 'auto'}}>Sii wad iibsiga</Link>
      </div>
    );
  }

  return (
    <div className="cart-checkout-page container section-padding">
      {step === 3 ? (
        <div className="success-state" style={{textAlign: 'center', padding: '4rem 0'}}>
          <div className="success-icon" style={{width: '60px', height: '60px', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'}}>
            ✓
          </div>
          <h2 className="title-large" style={{marginBottom: '1rem'}}>Waad ku mahadsantahay!</h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Dalabkaaga si guul leh ayaa loo xaqiijiyay. Gudaha Muqdisho — isla maalintaas baa lagu soo gaarsiinayaa.</p>
          <Link to="/shop" className="btn-primary" style={{display: 'inline-flex', width: 'auto'}}>Hore u soco</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          
          {/* Main Content Area */}
          <div className="checkout-main">
            <h1 className="title-large" style={{marginBottom: '2rem'}}>
              {step === 1 ? 'Gaarigaaga' : 'Xaqiiji dalabkaaga'}
            </h1>

            {step === 1 ? (
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item" style={{display: 'flex', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)'}}>
                    <img src={item.image} alt={item.name} style={{width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px'}} />
                    <div className="cart-item-info" style={{flex: 1}}>
                      <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)'}}>{item.name}</h3>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                        Cabirka: {item.selectedSize}
                      </p>
                      
                      <div className="cart-item-actions" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className="quantity-controls" style={{display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '0.25rem 0.5rem'}}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{padding: '0.25rem'}}><Minus size={14} /></button>
                          <span style={{fontSize: '0.9rem'}}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{padding: '0.25rem'}}><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem'}}>
                          <Trash2 size={14} /> Tirtir
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price" style={{fontWeight: '500'}}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                <div className="form-group">
                  <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Magaca</label>
                  <input type="text" required placeholder="Gali magacaaga oo buuxa" style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--secondary-color)'}} />
                </div>
                <div className="form-group">
                  <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Lambarka taleefanka</label>
                  <input type="tel" required placeholder="061XXXXXXX" style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--secondary-color)'}} />
                </div>
                <div className="form-group">
                  <label style={{fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block'}}>Goobta</label>
                  <input type="text" required placeholder="Tusaale: Maka Al Mukarama, Muqdisho" style={{width: '100%', padding: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--secondary-color)'}} />
                </div>
                
                <h3 style={{fontFamily: 'var(--font-heading)', marginTop: '1rem'}}>Qaabka Lacag Bixinta</h3>
                <div className="payment-options" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--primary-color)', borderRadius: '8px', background: 'var(--pill-bg)'}}>
                    <input type="radio" name="payment" value="mobile" defaultChecked />
                    EVC Plus / Zaad
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px'}}>
                    <input type="radio" name="payment" value="cod" />
                    Lacag marka la keeno
                  </label>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary" style={{backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', height: 'max-content'}}>
            <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem'}}>Macluumaadka Dalabka</h3>
            
            {effectiveDiscountPercent > 0 && (
              <div className="summary-line" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--success-color)'}}>
                <span>Qiimo Dhimis ({effectiveDiscountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-line" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)'}}>
              <span>Gaarsiinta</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>

            {/* Coupon Section */}
            <form onSubmit={handleApplyCoupon} style={{marginBottom: '1.5rem', display: 'flex', gap: '0.5rem'}}>
               <input 
                 type="text" 
                 placeholder="Coupon code..." 
                 value={couponCode}
                 onChange={(e) => setCouponCode(e.target.value)}
                 style={{flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem'}}
                 disabled={isCouponApplied}
               />
               <button type="submit" className="btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}} disabled={isCouponApplied}>
                  {isCouponApplied ? 'OK' : 'Gasho'}
               </button>
            </form>
            {couponError && <p style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '-1rem', marginBottom: '1rem'}}>{couponError}</p>}

            <div className="summary-line total" style={{display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontWeight: '600', fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '2rem'}}>
              <span>Wadarta</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {step === 1 ? (
              <button className="btn-primary" onClick={() => setStep(2)}>
                U gudub bixinta <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" form="checkout-form" className="btn-primary">
                Xaqiiji dalab
              </button>
            )}

            <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
              <Link to="/shop" style={{fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline'}}>Sii wad iibsiga</Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartCheckout;
