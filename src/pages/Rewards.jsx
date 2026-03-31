import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';
import { Gift, Share2, Copy, CheckCircle } from 'lucide-react';
import './Rewards.css';

const Rewards = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session) {
        const userId = session.user.id;
        // Mock backend: check local storage for visits to this user's link
        const storedVisits = localStorage.getItem(`referral_visits_${userId}`) || '0';
        setVisits(parseInt(storedVisits, 10));
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="container section-padding text-center">Waa la soo dhigayaa...</div>;

  if (!session) {
    return (
      <div className="container section-padding text-center" style={{maxWidth: '600px', margin: '0 auto'}}>
        <Gift size={48} color="var(--primary-color)" style={{margin: '0 auto 1.5rem'}} />
        <h2 className="title-large" style={{marginBottom: '1rem'}}>Abaalgudka Aura</h2>
        <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
          Fadlan is diwaangeli ama gal akoonkaaga si aad u hesho linkigaaga gaarka ah oo aad ugu guuleysato qiimo dhimis 10% ah.
        </p>
        <Link to="/profile" className="btn-primary" style={{display: 'inline-flex', width: 'auto'}}>
          Gal Akoonkaaga
        </Link>
      </div>
    );
  }

  const userId = session.user.id;
  // Construct the absolute URL
  const referralLink = `${window.location.origin}/?ref=${userId}`;
  const totalDiscount = Math.min(visits * 10, 100); // 10% per visit, up to 100%

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rewards-page container section-padding">
      <div className="rewards-header">
        <div className="gift-icon-wrap">
          <Gift size={32} />
        </div>
        <h1 className="title-large">Abaalgudkaaga (Rewards)</h1>
        <p className="rewards-subtitle">
          La wadaag asxaabtaada linkiga hoose. Qof kasta oo soo booqda linkiga, waxaad heleysaa <strong>10% qiimo dhimis (Discount)</strong> ah dalabkaaga xiga!
        </p>
      </div>

      <div className="rewards-dashboard">
        {/* Link Box */}
        <div className="referral-box">
          <label className="eyebrow">Linkigaaga Gaarka Ah</label>
          <div className="link-wrapper">
            <input type="text" readOnly value={referralLink} className="link-input" />
            <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`}>
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? 'Waa La Koobiyay' : 'Koobi Gareey'}
            </button>
          </div>
          <button className="btn-outline share-btn" onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Aura Fashion', url: referralLink });
            } else {
              handleCopy();
            }
          }}>
            <Share2 size={18} /> La Wadaag Asxaabta
          </button>
        </div>

        {/* Stats Box */}
        <div className="stats-box">
          <h3 className="stats-title">Booqashooyinka (Visits)</h3>
          <div className="stats-number">{visits}</div>
          <p className="stats-desc">Qof ayaa soo booqday linkigaaga.</p>
          
          <div className="discount-meter">
            <div className="discount-fill" style={{ width: `${totalDiscount}%` }}></div>
          </div>
          
          <div className="discount-status">
            <span>Qiimo Dhimiska Aad Heysato:</span>
            <strong className="text-success">{totalDiscount}% DISCOUNT</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
