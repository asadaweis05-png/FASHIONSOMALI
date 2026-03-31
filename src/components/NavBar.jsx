import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();

  const getNavClass = (path) => {
    // Basic exact match or partial match for active state
    if (path === '/' && location.pathname === '/') return 'active';
    if (path !== '/' && location.pathname.startsWith(path)) return 'active';
    return '';
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">Aura Somali</Link>
        
        <nav className="desktop-nav">
          <Link to="/" className={getNavClass('/') ? '' : ''}>Ururinta</Link>
          <Link to="/shop" className={getNavClass('/shop')}>Dukaanka</Link>
          <Link to="/heritage" className={getNavClass('/heritage')}>Dhaqanka</Link>
          <Link to="/ai-stylist" className={getNavClass('/ai-stylist')}>AI Stylist</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="icon-btn" aria-label="Gaariga">
            <ShoppingBag size={20} />
          </Link>
          <Link to="/profile" className="icon-btn" aria-label="Akoonka">
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
