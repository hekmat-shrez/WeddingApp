import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Assuming you will use this CSS file

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', { email, password });
      console.log('User registered:', response.data);
      navigate('/login'); // Redirect to login after successful sign up
    } catch (err) {
      console.error('Error during signup:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
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
        <button type="submit" className="auth-btn">Sign Up</button>
      </form>
      <p className="auth-toggle">
        Already have an account? <a href="/login">Sign In</a>
      </p>
    </div>
  );
};

export default SignUp;
