import React, { useState } from 'react';
import './PaymentPopup.css';

const PaymentPopup = ({ orderInfo, onPay, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
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
