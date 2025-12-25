import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Import from your firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './AdminSignin.css'; // Reuse the login styles

const AdminRegister = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Add user to 'admins' collection in Firestore
      await setDoc(doc(db, "admins", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        role: 'admin'
      });

      alert("Admin Account Created Successfully!");
      navigate('/admin/reports/sales');
      
    } catch (err) {
      console.error('Registration error:', err);
      // Handle Firebase specific errors
      if (err.code === 'auth/email-already-in-use') {
        setError('That email address is already in use!');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to register.');
      }
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
              {/* Ensure this path is correct or remove img if missing */}
              <img src="/logo.jpg" alt="CHOX" className="logo-image" />
            </div>
            <h1 className="brand-name">CHOX KITCHEN</h1>
          </div>
          {/* Secret Title */}
          <p className="signin-subtitle" style={{color: '#ffd700'}}>
            Secret Admin Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
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
              placeholder="Choose password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
            />
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Admin'}
          </button>
        </form>

        <div className="signin-footer">
          <p 
            onClick={() => navigate('/admin/signin')} 
            style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;