// components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; 2025 WeddingHero. All rights reserved.</p>
        <nav style={styles.footerNav}>
          <a href="/terms" style={styles.footerLink}>Terms of Service</a>
          <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
          <a href="/contact" style={styles.footerLink}>Contact Us</a>
        </nav>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNav: {
    display: 'flex',
  },
  footerLink: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
  },
};

export default Footer;