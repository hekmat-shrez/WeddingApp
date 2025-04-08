// components/FeaturedVenues.js
import React from 'react';
import VenueCard from './VenueCard';

const featuredVenues = [
  { id: 1, name: 'The Grand Ballroom', location: 'Toronto', imageUrl: 'https://via.placeholder.com/300x200/FFC107/000000?Text=Venue+1' },
  { id: 2, name: 'Rustic Barn Retreat', location: 'Muskoka', imageUrl: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?Text=Venue+2' },
  { id: 3, name: 'Waterfront Estate', location: 'Vancouver', imageUrl: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?Text=Venue+3' },
];

function FeaturedVenues() {
  return (
    <section style={styles.featured}>
      <div style={styles.container}>
        <h2 style={styles.title}>Featured Wedding Venues</h2>
        <div style={styles.venueList}>
          {featuredVenues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  featured: {
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
  venueList: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
};

export default FeaturedVenues;