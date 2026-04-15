import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { X, Gift } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import NavBar from './components/NavBar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AIStylist from './pages/AIStylist';
import CartCheckout from './pages/CartCheckout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Rewards from './pages/Rewards';
import Footer from './components/Footer';

function ScrollAndRefHandler() {
  const location = useLocation();
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Parse ?ref= from URL
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');

    if (refParam) {
      console.log('Referral link visited for user:', refParam);
      
      const hasVisited = sessionStorage.getItem(`visited_ref_${refParam}`);
      if (!hasVisited) {
        // 1. Reward the REFERRER (the one who shared the link)
        // We try to increment their count in Supabase if the table exists
        supabase.from('profiles')
          .select('referral_count')
          .eq('id', refParam)
          .single()
          .then(({ data }) => {
            const newCount = (data?.referral_count || 0) + 1;
            supabase.from('profiles')
              .update({ referral_count: newCount })
              .eq('id', refParam)
              .then(() => {
                console.log('Referrer reward synchronized to Supabase');
              });
          });

        // Also keep localStorage as a fallback/cache
        const currentVisits = parseInt(localStorage.getItem(`referral_visits_${refParam}`) || '0', 10);
        localStorage.setItem(`referral_visits_${refParam}`, currentVisits + 1);
        
        sessionStorage.setItem(`visited_ref_${refParam}`, 'true');
        
        // 2. Reward the VISITOR (the one who clicked)
        setShowCoupon(true);
      }
    }
  }, [location]);

  if (!showCoupon || location.pathname.startsWith('/admin')) return null;

  return (
    <div className="coupon-popup-overlay">
      <div className="coupon-popup">
        <button className="close-popup" onClick={() => setShowCoupon(false)}><X size={18}/></button>
        <div className="gift-icon-anim"><Gift size={32} /></div>
        <h3>Shukran! (Mahadsanid)</h3>
        <p>Sababtoo ah inaad soo booqatay xiriirka Aura, waxaad ku guuleysatay 10% qiimo dhimis ah.</p>
        <div className="coupon-code-box">
          <code>AURA10</code>
        </div>
        <button className="btn-primary" onClick={() => setShowCoupon(false)}>Isticmaal Hadda</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <ScrollAndRefHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/ai-stylist" element={<AIStylist />} />
            <Route path="/cart" element={<CartCheckout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
