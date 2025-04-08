import React, { useState } from 'react';
import venueData from './venueData';
import styles from './venueList.module.css';
import { LiaStarSolid, LiaStarHalf } from 'react-icons/lia';
import { Link } from 'react-router-dom';

const VenueList = () => {
  const [savedVenues, setSavedVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('Venues');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state variables
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [styleFilter, setStyleFilter] = useState('All');
  const [settingFilter, setSettingFilter] = useState('All');

  // Sorting state variable
  const [sortOption, setSortOption] = useState('Recommended');

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(venueData.length / itemsPerPage);

  // Helper function to render stars based on the rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<LiaStarSolid key={`full-${i}`} />);
    }

    // Add half star if necessary
    if (hasHalfStar) {
      stars.push(<LiaStarHalf key="half" />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<LiaStarSolid key={`empty-${i}`} style={{ opacity: 0.3 }} />);
    }

    return stars;
  };

  const toggleSaveVenue = (venueId) => {
    if (savedVenues.includes(venueId)) {
      setSavedVenues(savedVenues.filter(id => id !== venueId));
    } else {
      setSavedVenues([...savedVenues, venueId]);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Apply filters to venue data
  const filteredVenues = venueData.filter(venue => {
    // Filter by Capacity
    if (capacityFilter !== 'All' && !venue.NumberOfGuest.includes(capacityFilter)) {
      return false;
    }

    // Filter by Type
    if (typeFilter !== 'All' && venue.Type !== typeFilter) {
      return false;
    }

    // Filter by Style (check if any value in the array matches the selected style)
    if (styleFilter !== 'All' && venue.Style && !venue.Style.includes(styleFilter)) {
      return false;
    }

    // Filter by Setting (check if any value in the array matches the selected setting)
    if (settingFilter !== 'All' && venue.Setting && !venue.Setting.includes(settingFilter)) {
      return false;
    }

    return true;
  });

  // Sort venues based on the selected sort option
  const sortedVenues = filteredVenues.sort((a, b) => {
    switch (sortOption) {
      case 'Highest Rated':
        return b.Rating - a.Rating;
      case 'Lowest Rated':
        return a.Rating - b.Rating;
      case 'Price (Low to High)':
        return a.Price - b.Price;
      case 'Price (High to Low)':
        return b.Price - a.Price;
      default:
        return 0;
    }
  });

  // Get venues for the current page
  const currentVenues = sortedVenues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.venueFinder}>
      <div className={styles.searchHero}>
        <h1>Find Your Perfect Wedding Venue in Ontario</h1>
        <div className={styles.searchContainer}>
          <div className={styles.searchTabs}>
            {['Venues', 'Suppliers', 'Inspiration'].map(tab => (
              <div 
                key={tab}
                className={`${styles.searchTab} ${activeTab === tab ? styles.searchTabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <form className={styles.searchForm}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="What are you looking for?" 
              defaultValue="Wedding Venues" 
            />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Location" 
              defaultValue="Ontario" 
            />
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Filter by:</span>
            <select className={styles.filterSelect} onChange={(e) => setCapacityFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="50-100 guests">50-100 guests</option>
              <option value="100-200 guests">100-200 guests</option>
              <option value="200+ guests">200+ guests</option>
            </select>
            <select className={styles.filterSelect} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Chapel">Chapel</option>
              <option value="Lakeside Pavilion">Lakeside Pavilion</option>
              <option value="Banquet Hall">Banquet Hall</option>
              <option value="Ballroom">Ballroom</option>
              <option value="Outdoor Garden">Outdoor Garden</option>
            </select>
            <select className={styles.filterSelect} onChange={(e) => setStyleFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Classic">Classic</option>
              <option value="Vintage">Vintage</option>
              <option value="Rustic">Rustic</option>
              <option value="Elegant">Elegant</option>
              <option value="Modern">Modern</option>
            </select>
            <select className={styles.filterSelect} onChange={(e) => setSettingFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Waterfront">Waterfront</option>
              <option value="Garden">Garden</option>
              <option value="Uncovered Outdoor">Uncovered Outdoor</option>
            </select>
          </div>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>{sortedVenues.length} Wedding Venues in Ontario</div>
          <div className={styles.resultsCount}>
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedVenues.length)} of {sortedVenues.length} venues
          </div>
          <select className={styles.sortSelect} onChange={(e) => setSortOption(e.target.value)}>
            <option value="Recommended">Sort by: Recommended</option>
            <option value="Highest Rated">Sort by: Highest Rated</option>
            <option value="Lowest Rated">Sort by: Most Reviews</option>
            <option value="Price (Low to High)">Sort by: Price (Low to High)</option>
            <option value="Price (High to Low)">Sort by: Price (High to Low)</option>
          </select>
        </div>

        <div className={viewMode === 'grid' ? styles.venueGrid : styles.venueList}>
          {currentVenues.length === 0 ? (
            <div className={styles.noResults}>No venues found matching your filters.</div>
          ) : (
            currentVenues.map((venue) => (
              <div key={venue.id} className={styles.venueCard}>
                <div className={styles.venueImage}>
                  <img 
                    src={`${process.env.PUBLIC_URL}/Images/${venue.Image}`}
                    alt={venue.Name}
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/Images/placeholder.jpg`;
                    }}
                  />
                  {venue.badge && <div className={styles.venueBadge}>{venue.badge}</div>}
                </div>

                <div className={styles.venueDetails}>
                  <h3 className={styles.venueName}>
                    <Link to={`/DetailVenue/${venue.id}`}>{venue.Name}</Link>
                  </h3>
                  
                  <div className={styles.venueLocation}>
                    {venue.Location.replace('·', '').trim()}
                  </div>

                  <div className={styles.venueInfo}>
                    <div className={styles.venueRating}>
                      <span className={styles.stars}>{renderStars(venue.Rating)}</span>
                      <span className={styles.ratingValue}>{venue.Rating}</span>
                    </div>
                    <div className={styles.capacityInfo}>
                      {venue.NumberOfGuest}
                    </div>
                  </div>

                  <p className={styles.venueDescription}>{venue.Description}</p>

                  <div className={styles.venueActions}>
                    <Link className={styles.actionBtn} to={`/DetailVenue/${venue.id}`}>
                      View Details
                    </Link>
                    <button
                      className={`${styles.actionBtn} ${styles.saveBtn} ${
                        savedVenues.includes(venue.id) ? styles.saveBtnSaved : ''
                      }`}
                      onClick={() => toggleSaveVenue(venue.id)}
                    >
                      <i className={savedVenues.includes(venue.id) ? 'fas fa-heart' : 'far fa-heart'}></i> Save
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={handlePreviousPage} disabled={currentPage === 1}>
            <i className="fas fa-chevron-left"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button 
                key={pageNumber}
                className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.pageBtnActive : ''}`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button className={styles.pageBtn} onClick={handleNextPage} disabled={currentPage === totalPages}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueList;



// import React, { useState } from 'react';
// import venueData from './venueData';
// import styles from './venueList.module.css';
// import { LiaStarSolid, LiaStarHalf } from 'react-icons/lia'; 
// import { Link } from 'react-router-dom'



// const VenueList = () => {
//   const [savedVenues, setSavedVenues] = useState([]);
//   const [activeTab, setActiveTab] = useState('Venues');
//   const [viewMode, setViewMode] = useState('grid');
//   const [currentPage, setCurrentPage] = useState(1);

//  // Calculate pagination values
//   const itemsPerPage = Math.ceil(venueData.length / 10);
//   const totalPages = 10;
//   const currentVenues = venueData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//       // Helper function to render stars based on the rating
//       const renderStars = (rating) => {
//         const fullStars = Math.floor(rating); // Full stars
//         const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
//         const emptyStars = 5 - Math.ceil(rating); // Empty stars to fill up to 5
    
//         const stars = [];
    
//         // Add full stars
//         for (let i = 0; i < fullStars; i++) {
//           stars.push(<LiaStarSolid key={`full-${i}`} />);
//         }
    
//         // Add half star if necessary
//         if (hasHalfStar) {
//           stars.push(<LiaStarHalf key="half" />);
//         }
    
//         // Add empty stars
//         for (let i = 0; i < emptyStars; i++) {
//           stars.push(<LiaStarSolid key={`empty-${i}`} style={{ opacity: 0.3 }} />); // You can adjust opacity for empty stars
//         }
    
//         return stars;
//       };

//   const toggleSaveVenue = (venueId) => {
//     if (savedVenues.includes(venueId)) {
//       setSavedVenues(savedVenues.filter(id => id !== venueId));
//     } else {
//       setSavedVenues([...savedVenues, venueId]);
//     }
//   };
  


//   const handlePreviousPage = () => {
//     setCurrentPage(prev => Math.max(1, prev - 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prev => Math.min(totalPages, prev + 1));
//   };



//   return (
//     <div className={styles.venueFinder}>
//       <div className={styles.searchHero}>
//         <h1>Find Your Perfect Wedding Venue in Ontario</h1>
//         <div className={styles.searchContainer}>
//           <div className={styles.searchTabs}>
//             {['Venues', 'Suppliers', 'Inspiration'].map(tab => (
//               <div 
//                 key={tab}
//                 className={`${styles.searchTab} ${activeTab === tab ? styles.searchTabActive : ''}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </div>
//             ))}
//           </div>
//           <form className={styles.searchForm}>
//             <input 
//               type="text" 
//               className={styles.searchInput} 
//               placeholder="What are you looking for?" 
//               defaultValue="Wedding Venues" 
//             />
//             <input 
//               type="text" 
//               className={styles.searchInput} 
//               placeholder="Location" 
//               defaultValue="Ontario" 
//             />
//             <button type="submit" className={styles.searchBtn}>Search</button>
//           </form>
//         </div>
//       </div>

//       <div className={styles.filterSection}>
//         <div className={styles.filterContainer}>
//           <div className={styles.filterGroup}>
//             <span className={styles.filterLabel}>Filter by:</span>
//             <select className={styles.filterSelect}>
//               <option>Capacity</option>
//               <option>50-100 guests</option>
//               <option>100-200 guests</option>
//               <option>200+ guests</option>
//             </select>
//             <select className={styles.filterSelect}>
//               <option>Venue Type</option>
//               <option>Chapel</option>
//               <option>Lakeside Pavilion</option>
//               <option>Banquet Hall</option>
//               <option>Ballroom</option>
//               <option>Outdoor Garden</option>
//             </select>
//             <select className={styles.filterSelect}>
//               <option>Venue Style</option>
//               <option>Classic</option>
//               <option>Vintage</option>
//               <option>Rustic</option>
//               <option>Elegant</option>
//               <option>Modern</option>
//             </select>
//             <select className={styles.filterSelect}>
//               <option>Venue Setting</option>
//               <option>Waterfront</option>
//               <option>Garden</option>
//               <option>Uncovered Outdoor</option>
//             </select>
//           </div>
//           <div className={styles.viewToggle}>
//             <button 
//               className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
//               onClick={() => setViewMode('grid')}
//             >
//               <i className="fas fa-th"></i>
//             </button>
//             <button 
//               className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
//               onClick={() => setViewMode('list')}
//             >
//               <i className="fas fa-list"></i>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className={styles.resultsSection}>
//         <div className={styles.resultsHeader}>
//           <div className={styles.resultsCount}>{venueData.length} Wedding Venues in Ontario</div>
//           <div className={styles.resultsCount}>
//             Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, venueData.length)} of {venueData.length} venues
//           </div>
//           <select className={styles.sortSelect}>
//             <option>Sort by: Recommended</option>
//             <option>Sort by: Highest Rated</option>
//             <option>Sort by: Most Reviews</option>
//             <option>Sort by: Price (Low to High)</option>
//             <option>Sort by: Price (High to Low)</option>
//           </select>
//         </div>

//         <div className={viewMode === 'grid' ? styles.venueGrid : styles.venueList}>
//         {currentVenues.map((venue) => (
//             <div key={venue.id} className={styles.venueCard}>
//               <div className={styles.venueImage}>
//                 <img 
//                   src={`${process.env.PUBLIC_URL}/Images/${venue.Image}`}
//                   alt={venue.Name}
//                   onError={(e) => {
//                     e.target.src = `${process.env.PUBLIC_URL}/Images/placeholder.jpg`;
//                   }}
//                 />
//                 {venue.badge && <div className={styles.venueBadge}>{venue.badge}</div>}
//               </div>
              
//               <div className={styles.venueDetails}>
//                 <h3 className={styles.venueName}>
//                 <Link 
//                     to={`/DetailVenue/${venue.id}`}
//                     >
//                     {venue.Name}
//                  </Link>
//                 </h3>
                
//                 <div className={styles.venueLocation}>
//                   {venue.Location.replace('·', '').trim()}
//                 </div>

//                 <div className={styles.venueInfo}>
//                 <div className={styles.venueRating}>
//                   <div>
//                     <span className={styles.stars}>
//                     {renderStars(venue.Rating)}
//                     </span>
//                     <span className={styles.ratingValue}>{venue.Rating}</span>
//                     </div>
//                     <div className={styles.ratingValue}>
//                     {venue.NumberOfGuest.split().map((line, idx) => (
//                       <div key={idx}>{line.trim()}</div>
//                     ))}
//                   </div>
//                 </div>

                  
                
//                 </div>

//                 <p className={styles.venueDescription}>{venue.Description}</p>

//                 <div className={styles.venueActions}>
//                 <Link className={styles.actionBtn}
//                     to={`/DetailVenue/${venue.id}`}
//                     >
//                     View Details
//                  </Link>
//                   <button
//                     className={`${styles.actionBtn} ${styles.saveBtn} ${
//                       savedVenues.includes(venue.id) ? styles.saveBtnSaved : ''
//                     }`}
//                     onClick={() => toggleSaveVenue(venue.id)}
//                   >
//                     <i
//                       className={
//                         savedVenues.includes(venue.id)
//                           ? "fas fa-heart"
//                           : "far fa-heart"
//                       }
//                     ></i>{" "}
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className={styles.pagination}>
//         <button 
//             className={styles.pageBtn} 
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//           >
//             <i className="fas fa-chevron-left"></i>
//           </button>
          
//           {[...Array(totalPages)].map((_, index) => {
//             const pageNumber = index + 1;
//             return (
//               <button 
//                 key={pageNumber}
//                 className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.pageBtnActive : ''}`}
//                 onClick={() => setCurrentPage(pageNumber)}
//               >
//                 {pageNumber}
//               </button>
//             );
//           })}

//           <button 
//             className={styles.pageBtn} 
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//           >
//             <i className="fas fa-chevron-right"></i>
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default VenueList;