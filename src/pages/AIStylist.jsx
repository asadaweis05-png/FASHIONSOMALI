import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ShoppingBag, Bug } from 'lucide-react';
import { getAIStylistResponse, testAIConnection } from '../services/geminiClient';
import PaymentPopup from '../components/PaymentPopup';
import './AIStylist.css';

const AIStylist = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ku soo dhawoow Aura! Sideen ku caawin karaa maanta? Ma dhar ayaad rabtaa mise talo dhinaca labiska ah?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setDiagnosticResult(null);

    try {
      const response = await getAIStylistResponse(userMessage);

      if (response.rawError) {
        setDiagnosticResult(`Error: ${response.rawError}`);
      }

      // Check if it's an order intent
      if (response.intent === 'order' && response.orderInfo) {
        setOrderData(response.orderInfo);
        
        // Add assistant message before popup
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: `Waayahay! Aan kuu diyaariyo bixinta lacagta ee dalabkaaga: ${response.orderInfo.product || 'Alaabta'} - Cabirka (${response.orderInfo.size || 'Kama baahna'}). Fadlan dhamaystir bixinta lacagta hoos.` 
          }
        ]);
        
        // Trigger popup
        setTimeout(() => {
          setShowPayment(true);
        }, 800);
      } else {
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: response.message || "Waan gartay." }
        ]);
      }
    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, { role: 'assistant', content: 'Waan ka xumahay, khadka ayaa go\'ay. Fadlan mar kale isku day.' }]);
    } finally {
       setIsLoading(false);
    }
  };

  const runTest = async () => {
    setIsLoading(true);
    setDiagnosticResult("Testing connection...");
    const result = await testAIConnection();
    if (result.success) {
      setDiagnosticResult("✅ Connection SUCCESS! The AI is reachable.");
    } else {
      setDiagnosticResult(`❌ Connection FAILED: ${result.error}`);
    }
    setIsLoading(false);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setOrderData(null);
    setMessages(prev => [
       ...prev, 
       { role: 'assistant', content: 'Waad ku mahadsan tahay dalabkaaga! Waa la xaqiijiyay, waana laguu soo dhiibayaa dhowaan. Wax intaas dheer ma kugu caawin karaa?' }
    ]);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setOrderData(null);
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <Sparkles className="header-icon" />
        <div className="header-info">
          <h1>Aura AI Stylist</h1>
          <span className="status-dot"></span><span className="status-text">Waa onlayn</span>
          <span style={{fontSize: '0.7rem', opacity: 0.5, marginLeft: '0.5rem'}}>v3.0-fetch</span>
        </div>
        <button 
          className="debug-toggle" 
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          title="Diagnostic Tools"
        >
          <Bug size={18} />
        </button>
      </div>

      {showDiagnostics && (
        <div className="diagnostic-panel" style={{background: '#f8f9fa', padding: '1rem', borderBottom: '1px solid #ddd', fontSize: '0.85rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
            <strong>AI Diagnostics:</strong>
            <button onClick={runTest} disabled={isLoading} style={{padding: '2px 8px', fontSize: '0.75rem'}}>Run Test</button>
          </div>
          {diagnosticResult && (
            <div style={{color: diagnosticResult.startsWith('✅') ? 'green' : 'red', wordBreak: 'break-all', fontFamily: 'monospace'}}>
              {diagnosticResult}
            </div>
          )}
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble-wrapper ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="avatar-circle">
                <Sparkles size={16} />
              </div>
            )}
            <div className={`message-bubble ${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble-wrapper assistant">
            <div className="avatar-circle">
               <Sparkles size={16} />
            </div>
            <div className="message-bubble assistant typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Ila hadal... tusaale: Waxaan rabaa dirac cabirka M ah" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || showPayment}
        />
        <button type="submit" disabled={!input.trim() || isLoading || showPayment} className="send-btn">
          <Send size={20} />
        </button>
      </form>

      {showPayment && orderData && (
        <PaymentPopup 
           orderInfo={orderData} 
           onPay={handlePaymentComplete}
           onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default AIStylist;
