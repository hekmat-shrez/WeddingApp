import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Listen for login/logout events
    const handleLoginChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Listen to storage events (for cross-tab synchronization)
    window.addEventListener('storage', handleLoginChange);
    // Listen to custom login event
    window.addEventListener('login', handleLoginChange);
    // Listen to custom logout event
    window.addEventListener('logout', handleLoginChange);
    
    return () => {
      window.removeEventListener('storage', handleLoginChange);
      window.removeEventListener('login', handleLoginChange);
      window.removeEventListener('logout', handleLoginChange);
    };
  }, []);
  
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Dispatch logout event
    window.dispatchEvent(new Event('logout'));
    setIsLoggedIn(false);
    // Redirect to home page
    navigate('/');
  };
  
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <a href="/"><div style={styles.logo}>Wedding</div></a>
        <nav style={styles.nav}>
          <a href="/venues" style={styles.navLink}>Find Venues</a>
          <a href="/vendors" style={styles.navLink}>Find Vendors</a>
          <a href="/planning" style={styles.navLink}>Planner</a>
          {isLoggedIn ? (
            // Show logout button when user is logged in
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          ) : (
            // Show login and signup links when user is not logged in
            <>
              <a href="/login" style={styles.navLink}>Login</a>
              <a href="/signup" style={styles.navLink}>Sign Up</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#f8f8f8',
    padding: '20px 0',
    borderBottom: '1px solid #eee',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: '#555',
    textDecoration: 'none',
    marginLeft: '20px',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    marginLeft: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  }
};

export default Header;