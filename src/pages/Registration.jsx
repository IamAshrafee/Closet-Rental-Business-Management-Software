import React, { useState, useEffect } from "react";
import { FiUserPlus, FiUser, FiMail, FiLock } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import {
  initializeApp
} from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDgFLWJLTz3tF40NjNBl8s9eLd6OLk3WiM",
  authDomain: "closet-rental-business.firebaseapp.com",
  projectId: "closet-rental-business",
  storageBucket: "closet-rental-business.firebasestorage.app",
  messagingSenderId: "145160803642",
  appId: "1:145160803642:web:d0beae89249c73e44c6c03",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const Registration = () => {
  const userInfo = useSelector((state) => state.userLogInfo.value);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firebaseError, setFirebaseError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirebaseError("");

    let isValid = true;

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

    if (!isValid) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, { displayName: fullName });

      await set(ref(db, "users/" + userCredential.user.uid), {
        username: fullName,
        email: email,
      });

      await sendEmailVerification(auth.currentUser);

      navigate("/login");
    } catch (error) {
      setFirebaseError(error.message);
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email already in use");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row-reverse bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-indigo-600 text-white p-12 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold font-poppins mb-3">Welcome!</h1>
          <p className="text-lg text-indigo-200">
            Join Rentiva to manage your rental business seamlessly.
          </p>
          <div className="mt-8 w-32 h-1 bg-indigo-400 rounded-full"></div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Create Account
          </h2>
          <p className="text-gray-500 mb-8">
            Let's get you started with a new account.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  nameError ? "border-red-500" : "border-gray-300"
                }`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={!!nameError}
                aria-describedby="name-error"
              />
              {nameError && (
                <p id="name-error" className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">Email Address</label>
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!confirmPasswordError}
                aria-describedby="confirmPassword-error"
              />
              {confirmPasswordError && (
                <p id="confirmPassword-error" className="text-red-500 text-sm mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {firebaseError && (
              <p className="text-red-500 text-sm">{firebaseError}</p>
            )}

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
