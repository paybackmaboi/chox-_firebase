import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, app } from '../../firebase'; // Import app instance as well
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import AlertModal from './AlertModal';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertState({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertState({ ...alertState, isOpen: false });
    if (alertState.title === 'Success') { // Navigate after success alert closes
      navigate('/admin/reports/sales');
    }
  };

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
      // 1. Create a secondary Firebase App instance to create the user
      // This prevents the current admin from being logged out
      let secondaryApp;
      // Check if secondary app already initializes using getApps() to avoid throwing errors
      const existingApp = getApps().find(app => app.name === "secondary");
      if (existingApp) {
        secondaryApp = existingApp;
      } else {
        secondaryApp = initializeApp(app.options, "secondary");
      }

      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Add user to 'admins' collection in Firestore using the PRIMARY auth (current admin)
      // The write happens as the currently logged-in admin, so it passes security rules.
      // NOTE: We use user.uid from the NEW user.
      await setDoc(doc(db, "admins", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        role: 'admin'
      });

      // Cleanup secondary app/auth is handled by Firebase SDK but good to just leave it.
      // We sign out the secondary auth to be clean, though not strictly required for logic.
      await signOut(secondaryAuth);

      showAlert("Success", "Admin Account Created Successfully!", "success");
      // Navigation happens in closeAlert now to allow user to see message
      // navigate('/admin/reports/sales');

    } catch (err) {
      console.error('Registration error:', err);
      // Handle Firebase specific errors
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered. Cannot create new admin with existing user via this form.');
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
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden md:p-[15px] sm:p-[10px] bg-black">
      {/* Real Photo Background with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) contrast(1.1) blur(2px)'
        }}
      ></div>
      {/* Dark Gradient Overlay for clearer text */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      <div className="bg-[linear-gradient(135deg,#1a1a1a_0%,#2a2a2a_100%)] border-2 border-[#ffd700] rounded-[20px] shadow-[0_0_60px_rgba(255,215,0,0.3),0_20px_60px_rgba(0,0,0,0.5)] p-[50px_40px] max-w-[480px] w-full relative z-10 md:p-[40px_30px] md:rounded-[15px] sm:p-[30px_25px] sm:rounded-xl sm:border">
        <div className="text-center mb-[40px]">
          <div className="flex flex-col items-center gap-5 mb-5 md:gap-4 md:mb-4 sm:gap-4 sm:mb-4">
            <div className="w-[100px] h-[100px] bg-[#1a1a1a] border-[3px] border-[#ffd700] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)] md:w-[90px] md:h-[90px] sm:w-[80px] sm:h-[80px]">
              <img src="/logo.jpg" alt="CHOX" className="w-full h-full object-cover rounded-full" />
            </div>
            <h1 className="text-[32px] bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] bg-clip-text text-transparent m-0 font-black tracking-[3px] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] md:text-[28px] md:tracking-[2px] sm:text-[24px] sm:tracking-[1px]">CHOX KITCHEN</h1>
          </div>
          {/* Secret Title */}
          <p className="text-[#ffd700] text-[14px] font-medium tracking-[1px] uppercase md:text-[12px] sm:text-[11px]">
            Secret Admin Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-5 md:mb-4 sm:mb-[18px]">
          {error && <div className="bg-red-600/10 border border-red-600 text-red-300 p-3 rounded-lg mb-5 text-sm text-center">{error}</div>}

          <div className="mb-6 md:mb-5 sm:mb-[18px]">
            <label htmlFor="email" className="block mb-2.5 text-[#ffd700] font-semibold text-[13px] tracking-[0.5px] uppercase sm:text-xs">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
              className="w-full p-[14px_18px] bg-[#0f0f0f] border-2 border-[#3a3a3a] rounded-[10px] text-[14px] text-[#e5e5e5] transition-all duration-300 focus:outline-none focus:border-[#ffd700] focus:shadow-[0_0_15px_rgba(255,215,0,0.2)] focus:bg-[#1a1a1a] placeholder:text-gray-500 md:p-[12px_16px] md:text-[13px] sm:p-[12px_14px]"
            />
          </div>

          <div className="mb-6 md:mb-5 sm:mb-[18px]">
            <label htmlFor="password" className="block mb-2.5 text-[#ffd700] font-semibold text-[13px] tracking-[0.5px] uppercase sm:text-xs">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Choose password"
              minLength="6"
              className="w-full p-[14px_18px] bg-[#0f0f0f] border-2 border-[#3a3a3a] rounded-[10px] text-[14px] text-[#e5e5e5] transition-all duration-300 focus:outline-none focus:border-[#ffd700] focus:shadow-[0_0_15px_rgba(255,215,0,0.2)] focus:bg-[#1a1a1a] placeholder:text-gray-500 md:p-[12px_16px] md:text-[13px] sm:p-[12px_14px]"
            />
          </div>

          <div className="mb-6 md:mb-5 sm:mb-[18px]">
            <label htmlFor="confirmPassword" className="block mb-2.5 text-[#ffd700] font-semibold text-[13px] tracking-[0.5px] uppercase sm:text-xs">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              className="w-full p-[14px_18px] bg-[#0f0f0f] border-2 border-[#3a3a3a] rounded-[10px] text-[14px] text-[#e5e5e5] transition-all duration-300 focus:outline-none focus:border-[#ffd700] focus:shadow-[0_0_15px_rgba(255,215,0,0.2)] focus:bg-[#1a1a1a] placeholder:text-gray-500 md:p-[12px_16px] md:text-[13px] sm:p-[12px_14px]"
            />
          </div>

          <button type="submit" className="w-full p-4 bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] text-[#0a0a0a] border-none rounded-[10px] text-base font-bold cursor-pointer transition-all duration-300 tracking-[1px] uppercase hover:disabled:transform-none hover:-translate-y-[3px] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:bg-[linear-gradient(135deg,#ffed4e_0%,#ffd700_100%)] disabled:opacity-50 disabled:cursor-not-allowed md:p-[14px] md:text-[14px] sm:p-[13px] sm:text-[13px]" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Admin'}
          </button>
        </form>

        <div className="text-center pt-[25px] border-t border-[#3a3a3a] mt-[30px] sm:pt-5 sm:mt-[25px]">
          <p
            onClick={() => navigate('/admin/signin')}
            className="text-[12px] text-[#ffd700] font-bold md:text-[11px] sm:text-[10px] sm:px-[10px] sm:leading-snug cursor-pointer underline hover:text-[#ffed4e] transition-colors"
          >
            Back to Login
          </p>
        </div>
      </div>

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
};

export default AdminRegister;