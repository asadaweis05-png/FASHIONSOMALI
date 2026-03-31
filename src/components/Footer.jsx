import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">Aura Somali</h2>
          <p className="footer-tagline">
            Style-kaaga, si fudud u hel.
          </p>
          <p className="footer-copyright">
            © 2024 AURA SOMALI. DHARKAAGA SI KALSOONI LEH U DOORO.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>SAHAMI</h3>
            <ul>
              <li><a href="#">DHAQANKA</a></li>
              <li><a href="#">TAYADA</a></li>
              <li><a href="#">AI STYLIST</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>CAAWINAAD</h3>
            <ul>
              <li><a href="#">GAARSIINTA</a></li>
              <li><a href="#">NAGALA SOO XARIIR</a></li>
              <li><a href="#">SIDA WAX LOO CELIYO</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <h3>WARARKA</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="IIMAYLKAAGA" aria-label="Iimaylkaaga" />
            <button type="submit" aria-label="Is diwaangeli"><ArrowRight size={16} /></button>
          </form>
          <p className="newsletter-hint">Kusoo biir safarkena casriga ah.</p>
          <div style={{marginTop: '1.5rem'}}>
            <a href="https://wa.me/123456789" className="btn-outline" style={{display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: '#25D366', color: '#25D366'}}>
               La hadal hadda WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
