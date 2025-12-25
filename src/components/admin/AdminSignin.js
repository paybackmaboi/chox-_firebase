import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import './AdminSignin.css';

const AdminSignin = () => {
  // Switched username to email as Firebase uses email by default
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase Sign In
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Navigate to dashboard on success
      navigate('/admin/reports/sales');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signin">
      <div className="signin-container">
        <div className="signin-header">
          <div className="logo-container">
            <div className="logo-circle">
              <img src="/logo.jpg" alt="CHOX Kitchen" className="logo-image" />
            </div>
            <h1 className="brand-name">CHOX KITCHEN</h1>
          </div>
          <p className="signin-subtitle">Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email" // Changed type to email
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;