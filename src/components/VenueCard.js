// components/VenueCard.js
import React from 'react';

function VenueCard({ venue }) {
  return (
    <div style={styles.card}>
      <img src={venue.imageUrl} alt={venue.name} style={styles.image} />
      <div style={styles.details}>
        <h3 style={styles.name}>{venue.name}</h3>
        <p style={styles.location}>{venue.location}</p>
        <button style={styles.viewButton}>View Details</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '300px',
    marginBottom: '30px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  details: {
    padding: '20px',
    textAlign: 'center',
  },
  name: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#333',
  },
  location: {
    color: '#777',
    marginBottom: '15px',
  },
  viewButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default VenueCard;