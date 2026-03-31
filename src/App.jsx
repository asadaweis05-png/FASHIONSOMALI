import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Parse ?ref= from URL
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');

    if (refParam) {
      // We found a referral link visit!
      console.log('Referral link visited for user:', refParam);
      
      // To prevent a user from refreshing the page over and over to give infinite visits:
      // We check if this specific browser has already visited this ref link recently.
      const hasVisited = sessionStorage.getItem(`visited_ref_${refParam}`);
      if (!hasVisited) {
        // Increment the visits for that user ID in our mock backend (localStorage)
        const currentVisits = parseInt(localStorage.getItem(`referral_visits_${refParam}`) || '0', 10);
        localStorage.setItem(`referral_visits_${refParam}`, currentVisits + 1);
        
        // Mark as visited in this browser session
        sessionStorage.setItem(`visited_ref_${refParam}`, 'true');
      }
    }
  }, [location]);

  return null;
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
