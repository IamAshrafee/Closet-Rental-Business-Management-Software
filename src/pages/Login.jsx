// Import React and hooks
import React, { useState } from 'react';
// Import icons
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
// Import NavLink for navigation
import { NavLink, useNavigate } from 'react-router-dom';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase config (same as registration)
const firebaseConfig = {
  apiKey: "AIzaSyDgFLWJLTz3tF40NjNBl8s9eLd6OLk3WiM",
  authDomain: "closet-rental-business.firebaseapp.com",
  projectId: "closet-rental-business",
  storageBucket: "closet-rental-business.firebasestorage.app",
  messagingSenderId: "145160803642",
  appId: "1:145160803642:web:d0beae89249c73e44c6c03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');

  // Loading state for button
  const [loading, setLoading] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setFirebaseError('');

    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError('Please enter an email address');
      isValid = false;
    } else if (email.includes(' ')) {
      setEmailError('Email should not contain spaces');
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    // Start loading
    setLoading(true);

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (userCredential.user && !userCredential.user.emailVerified) {
        navigate('/verify-email');
      } else {
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      setFirebaseError(error.message);
      if (error.code === 'auth/user-not-found') {
        setEmailError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect password');
      }
    }

    // Stop loading
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Branding */}
        <div className="w-full md:w-1/2 bg-indigo-600 text-white p-12 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold font-poppins mb-3">Welcome Back!</h1>
          <p className="text-lg text-indigo-200">Log in to continue managing your rentals.</p>
          <div className="mt-8 w-32 h-1 bg-indigo-400 rounded-full"></div>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
          <p className="text-gray-500 mb-8">Access your Rentiva account.</p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email"
                placeholder="Email Address"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password"
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            {/* Firebase Error */}
            {firebaseError && <p className="text-red-500 text-sm">{firebaseError}</p>}

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              <FiLogIn />
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <NavLink to="/registration" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
