import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Assuming you will use this CSS file

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Updated the URL to match the correct backend login route
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      console.log('User logged in:', response.data);

      // Assuming the backend sends the token after login
      const token = response.data.token;

      // Optionally, save token to local storage or session storage
      localStorage.setItem('token', token);
      // In your login component after successful login
      window.dispatchEvent(new Event('login'));

      // Redirect to dashboard after successful sign in
      navigate('/');
    } catch (err) {
      console.error('Error during sign-in:', err);
      setError('Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-btn">Sign In</button>
      </form>
      <p className="auth-toggle">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;
