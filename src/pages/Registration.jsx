// Import React and hooks
import React, { useState, useEffect } from "react";
// Import icons
import { FiUserPlus, FiUser, FiMail, FiLock } from "react-icons/fi";
// Import NavLink for navigation
import { NavLink, useNavigate } from "react-router-dom";
// Import Redux hooks
import { useSelector } from 'react-redux';

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDgFLWJLTz3tF40NjNBl8s9eLd6OLk3WiM",
  authDomain: "closet-rental-business.firebaseapp.com",
  projectId: "closet-rental-business",
  storageBucket: "closet-rental-business.firebasestorage.app",
  messagingSenderId: "145160803642",
  appId: "1:145160803642:web:d0beae89249c73e44c6c03",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const Registration = () => {
  // Redux
  const userInfo = useSelector((state) => state.userLogInfo.value);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firebaseError, setFirebaseError] = useState("");

  // Loading state for button
  const [loading, setLoading] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirebaseError("");

    let isValid = true;

    // Validation checks
    if (!fullName.trim()) {
      setNameError("Full name is required");
      isValid = false;
    }
    if (!email) {
      setEmailError("Please enter an email address");
      isValid = false;
    } else if (email.includes(" ")) {
      setEmailError("Email should not contain spaces");
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    // Stop if any error
    if (!isValid) return;

    // Start loading
    setLoading(true);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with full name
      await updateProfile(auth.currentUser, { displayName: fullName });

      // Save user info in Realtime Database
      await set(ref(db, "users/" + userCredential.user.uid), {
        username: fullName,
        email: email,
      });

      // Send email verification
      await sendEmailVerification(auth.currentUser);

      navigate("/login");
    } catch (error) {
      setFirebaseError(error.message);
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email already in use");
      }
    }

    // Stop loading
    setLoading(false);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row-reverse bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Branding */}
        <div className="w-full md:w-1/2 bg-indigo-600 text-white p-12 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold font-poppins mb-3">Welcome!</h1>
          <p className="text-lg text-indigo-200">
            Join Rentiva to manage your rental business seamlessly.
          </p>
          <div className="mt-8 w-32 h-1 bg-indigo-400 rounded-full"></div>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Create Account
          </h2>
          <p className="text-gray-500 mb-8">
            Let's get you started with a new account.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  nameError ? "border-red-500" : "border-gray-300"
                }`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Firebase Error */}
            {firebaseError && (
              <p className="text-red-500 text-sm">{firebaseError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              <FiUserPlus />
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;