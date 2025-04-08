import React from 'react';


function HeroSection() {
  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>Find the perfect venue for your special day</h1>
        <p style={styles.heroSubtitle}>Browse hundreds of stunning wedding venues across Canada.</p>
        <div style={styles.searchBar}>
          <input type="text" placeholder="Enter location or venue name" style={styles.searchInput} />
          <button style={styles.searchButton}>Search</button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
    backgroundSize: 'cover',
    color: '#fff',
    textAlign: 'center',
    padding: '100px 0',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '30px',
  },
  searchBar: {
    display: 'flex',
    maxWidth: '500px',
    margin: '0 auto',
  },
  searchInput: {
    flexGrow: 1,
    padding: '15px',
    border: 'none',
    borderRadius: '5px 0 0 5px',
    fontSize: '16px',
  },
  searchButton: {
    backgroundColor: '#ff6f61',
    color: '#fff',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '0 5px 5px 0',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default HeroSection;