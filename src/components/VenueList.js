// components/VenueList.js
import React from 'react';
import VenueCard from './VenueCard';
import img from './img01.jpg'

const venues = [
  { id: 4, name: 'Elegant Manor', location: 'Montreal', imageUrl: img },
  { id: 5, name: 'Vineyard Wedding', location: 'Niagara-on-the-Lake', imageUrl: img },
  { id: 6, name: 'Mountain View Lodge', location: 'Calgary', imageUrl: img },
  // Add more venue data
];


function VenuesList() {
  return (
    <section style={styles.venueListSection}>
      <div style={styles.container}>
        <h2 style={styles.title}>Browse All Venues</h2>
        <div style={styles.list}>
          {venues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  venueListSection: {
    padding: '40px 0',
    backgroundColor: '#fff',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
  },
  list: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
};

export default VenuesList;