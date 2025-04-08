// components/SearchFilter.js
import React from 'react';

function SearchFilter() {
  return (
    <section style={styles.searchFilter}>
      <div style={styles.container}>
        <h2 style={styles.title}>Search and Filter Venues</h2>
        <div style={styles.filters}>
          <input type="text" placeholder="Location" style={styles.input} />
          <select style={styles.select}>
            <option value="">All Types</option>
            <option value="banquet-hall">Banquet Hall</option>
            <option value="farm">Farm</option>
            <option value="hotel">Hotel</option>
            {/* Add more options */}
          </select>
          <select style={styles.select}>
            <option value="">Guest Capacity</option>
            <option value="under-100">Under 100</option>
            <option value="100-300">100-300</option>
            <option value="300-plus">300+</option>
          </select>
          <button style={styles.filterButton}>Apply Filters</button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  searchFilter: {
    padding: '40px 0',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  filterButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default SearchFilter;