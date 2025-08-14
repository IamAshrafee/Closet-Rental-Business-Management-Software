import React, { useState } from 'react';
import { getAuth, sendEmailVerification } from 'firebase/auth';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const auth = getAuth();

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('A new verification email has been sent to your email address.');
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage('You are not logged in.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: '#333',
          fontSize: '24px',
          marginBottom: '20px',
        }}>Verify Your Email Address</h1>
        <p style={{
          color: '#666',
          fontSize: '16px',
          marginBottom: '30px',
        }}>
          We have sent a verification email to your email address. Please check your inbox and click on the link to verify your email.
        </p>
        <button 
          onClick={handleResendVerification}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Resend Verification Email
        </button>
        {message && <p style={{ marginTop: '20px', color: '#333' }}>{message}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;