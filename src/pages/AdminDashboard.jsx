import React, { useState, useEffect } from 'react';
import { products } from '../data/mockData';
import { Package, ShoppingBag, Users, Plus, Edit, Trash2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('global_orders') || '[]');
    setOrders(loaded);
  }, [activeTab]);

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} /> Products
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Orders
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Users
          </button>
        </nav>
      </div>

      <div className="admin-main">
        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Manage Products</h3>
              <button className="btn-primary" style={{ width: 'auto' }}>
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td><img src={product.image} alt={product.name} className="table-img" /></td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn edit-btn"><Edit size={16} /></button>
                          <button className="icon-btn delete-btn"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Recent Orders</h3>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Weli ma jiraan wax dalab ah.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td>#ORD-{order.id}</td>
                        <td>{order.customer}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td><span className="badge success">{order.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Manage Users</h3>
            </div>
            <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>
              User management will be available when Supabase Auth is fully connected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
