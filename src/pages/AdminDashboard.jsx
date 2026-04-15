import React, { useState, useEffect } from 'react';
import { products, lessons as initialLessons } from '../data/mockData';
import { Package, ShoppingBag, Users, Plus, Edit, Trash2, BookOpen, Link as LinkIcon, X } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [lessons, setLessons] = useState(initialLessons);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    try {
      const loaded = JSON.parse(localStorage.getItem('global_orders') || '[]');
      setOrders(Array.isArray(loaded) ? loaded : []);
      
      const rawLessons = localStorage.getItem('admin_lessons');
      let savedLessons;
      if (rawLessons) {
        savedLessons = JSON.parse(rawLessons);
      } else {
        savedLessons = initialLessons;
      }
      
      setLessons(Array.isArray(savedLessons) ? savedLessons : initialLessons);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setOrders([]);
      setLessons(initialLessons);
    }
  }, [activeTab]);

  const saveLessons = (updatedLessons) => {
    setLessons(updatedLessons);
    localStorage.setItem('admin_lessons', JSON.stringify(updatedLessons));
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm('Ma hubaal inaad tirto casharkan?')) {
      const updated = lessons.filter(l => l.id !== id);
      saveLessons(updated);
    }
  };

  const handleEditLesson = (lesson) => {
    setCurrentLesson({ ...lesson });
    setShowLessonModal(true);
  };

  const handleAddLesson = () => {
    console.log('Adding new lesson...');
    setCurrentLesson({
      id: Date.now().toString(),
      title: '',
      description: '',
      urls: [{ id: 'u' + Date.now(), label: '', url: '' }],
      createdAt: new Date().toISOString()
    });
    setShowLessonModal(true);
  };

  const handleSaveLesson = (e) => {
    e.preventDefault();
    console.log('Saving lesson:', currentLesson);
    const index = lessons.findIndex(l => l.id === currentLesson.id);
    let updated;
    if (index > -1) {
      updated = [...lessons];
      updated[index] = currentLesson;
    } else {
      updated = [currentLesson, ...lessons];
    }
    console.log('Updated lessons list:', updated);
    saveLessons(updated);
    setShowLessonModal(false);
  };

  const addUrlRow = () => {
    setCurrentLesson({
      ...currentLesson,
      urls: [...currentLesson.urls, { id: 'u' + Date.now(), label: '', url: '' }]
    });
  };

  const removeUrlRow = (id) => {
    setCurrentLesson({
      ...currentLesson,
      urls: currentLesson.urls.filter(u => u.id !== id)
    });
  };

  const updateUrlRow = (id, field, value) => {
    setCurrentLesson({
      ...currentLesson,
      urls: currentLesson.urls.map(u => u.id === id ? { ...u, [field]: value } : u)
    });
  };

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
            className={activeTab === 'lessons' ? 'active' : ''} 
            onClick={() => setActiveTab('lessons')}
          >
            <BookOpen size={18} /> Lessons
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

        {activeTab === 'lessons' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Manage Lessons</h3>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={handleAddLesson}>
                <Plus size={18} /> Add Lesson
              </button>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>URLs Count</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No lessons found.</td>
                    </tr>
                  ) : (
                    lessons.map(lesson => (
                      <tr key={lesson.id}>
                        <td>{lesson.title}</td>
                        <td>{lesson.urls.length} URLs</td>
                        <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-btns">
                            <button className="icon-btn edit-btn" onClick={() => handleEditLesson(lesson)}><Edit size={16} /></button>
                            <button className="icon-btn delete-btn" onClick={() => handleDeleteLesson(lesson.id)}><Trash2 size={16} /></button>
                          </div>
                        </td>
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

      {showLessonModal && currentLesson && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h4>{currentLesson.id.length > 10 ? 'Add New Lesson' : 'Edit Lesson'}</h4>
              <button className="close-btn" onClick={() => setShowLessonModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveLesson}>
              <div className="form-group">
                <label>Lesson Title</label>
                <input 
                  type="text" 
                  value={currentLesson.title} 
                  onChange={e => setCurrentLesson({...currentLesson, title: e.target.value})}
                  placeholder="e.g. Traditional Weaving"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={currentLesson.description} 
                  onChange={e => setCurrentLesson({...currentLesson, description: e.target.value})}
                  placeholder="Short summary of the lesson..."
                />
              </div>
              
              <div className="urls-section">
                <div className="urls-header">
                  <h5>Lesson Content (URLs)</h5>
                  <button type="button" className="btn-secondary btn-sm" onClick={addUrlRow}>
                    <LinkIcon size={14} /> Add URL
                  </button>
                </div>
                {currentLesson.urls.map(urlRow => (
                  <div key={urlRow.id} className="url-row">
                    <input 
                      type="text" 
                      placeholder="Label (e.g. Video Part 1)" 
                      value={urlRow.label}
                      onChange={e => updateUrlRow(urlRow.id, 'label', e.target.value)}
                      required
                    />
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={urlRow.url}
                      onChange={e => updateUrlRow(urlRow.id, 'url', e.target.value)}
                      required
                    />
                    <button type="button" className="remove-btn" onClick={() => removeUrlRow(urlRow.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowLessonModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
