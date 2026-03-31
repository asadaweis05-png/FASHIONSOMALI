import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Sparkles, ShoppingCart, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Hore' },
    { path: '/shop', icon: Grid, label: 'Dukaanka' },
    { path: '/ai-stylist', icon: Sparkles, label: 'AI' },
    { path: '/cart', icon: ShoppingCart, label: 'Gaariga' },
    { path: '/profile', icon: User, label: 'Akoonka' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
