import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Branding Section */}
        <div className="w-full md:w-1/2 bg-indigo-600 text-white p-12 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold font-poppins mb-3">Rentiva</h1>
          <p className="text-lg text-indigo-200">Closet Rental Management</p>
          <div className="mt-8 w-32 h-1 bg-indigo-400 rounded-full"></div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
          <p className="text-gray-500 mb-8">Welcome back! Please sign in to your account.</p>
          
          <form className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember" className="text-gray-600">Remember me</label>
              </div>
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              <FiLogIn />
              <span>Login</span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;