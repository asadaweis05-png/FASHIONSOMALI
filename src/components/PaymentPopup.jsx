import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './PaymentPopup.css';

const PaymentPopup = ({ orderInfo, onPay, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(async () => {
      
      // Save order
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;
        const existingOrders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]');
        
        const newOrder = {
          id: Math.floor(Math.random() * 100000),
          date: new Date().toLocaleDateString('sn-SO', { month: 'long', day: 'numeric', year: 'numeric' }),
          items: [{ name: orderInfo.product, price: 45, quantity: 1, image: 'https://images.unsplash.com/photo-1594938298596-eb5fd3f24bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' }],
          total: 45,
          status: 'La dhiibay'
        };
        
        localStorage.setItem(`user_orders_${userId}`, JSON.stringify([newOrder, ...existingOrders]));
      }

      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPay();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onCancel}>&times;</button>
        
        {!isSuccess ? (
          <>
            <h2 className="payment-title">Dhameystir Dalabkaaga</h2>
            <div className="order-summary">
              <div className="summary-row">
                <span>Alaabta:</span>
                <strong>{orderInfo.product || 'Dhar Guntiino'}</strong>
              </div>
              <div className="summary-row">
                <span>Cabirka:</span>
                <strong>{orderInfo.size || 'Kama baahna'}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Wadarta:</span>
                <strong>$45.00</strong>
              </div>
            </div>

            <button 
              className="btn-primary pay-button"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Waa la baarayaa...' : 'Bixi Lacagta (Waafi / EVC)'}
            </button>
          </>
        ) : (
          <div className="success-state">
            <div className="check-icon">✓</div>
            <h3>Waa Lagu Guulaystay!</h3>
            <p>Dalabkaaga waa la gudbiyay, waan kula soo xiriiri doonaa dhowaan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPopup;
