import React, { useState, useEffect } from 'react';
import styles from './VenueDetails.module.css';
import { useParams } from 'react-router-dom';
import Venuedata from './venueData.js'

function VenueDetails() {

  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const foundVenue = Venuedata.find(v => v.id === id);
    setVenue(foundVenue);
  }, [id]); // Add id as dependency

  if (!venue) {
    return <div className={styles.loading}>Loading venue details...</div>;
  }

  // Handle single image case
  const images = venue.Image ? [venue.Image] : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleContactClick = () => {
    console.log('Contact button clicked for:', venue.Name);
    alert(`Contact ${venue.Name}! (This will open a contact form)`);
  };

  // Format description with line breaks
  const formatDescription = (text) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className={styles.descriptionParagraph}>
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={styles.detailsContainer}>
      <h1 className={styles.name}>{venue.Name}</h1>
      <p className={styles.location}>{venue.Location.replace('·', '').trim()}</p>

      {/* Image Gallery */}
      <div className={styles.imageGallery}>
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={`${process.env.PUBLIC_URL}/Images/${imageUrl}`}
            alt={`${venue.Name} ${index + 1}`}
            className={styles.image}
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        ))}
      </div>
      
      {images.length > 1 && (
        <div className={styles.galleryControls}>
          <button className={styles.galleryButton} onClick={prevImage}>Previous</button>
          <button className={styles.galleryButton} onClick={nextImage}>Next</button>
        </div>
      )}

      {/* Description */}
      <div className={styles.description}>
        <h2 className={styles.sectionTitle}>About {venue.Name}</h2>
        <div className={styles.descriptionText}>
          {formatDescription(venue.DetailDescription || venue.Description)}
        </div>
      </div>

      {/* Guest Capacity */}
      <div className={styles.capacity}>
        <h2 className={styles.sectionTitle}>Guest Capacity</h2>
        <p>{venue.NumberOfGuest.replace('\n', ' ')}</p>
      </div>

  <div className={styles.amenities}>
      <h2 className={styles.sectionTitle}>Describe</h2>
      <ul className={styles.amenitiesList}>
      {venue.describe.map((d, index) => (
      <li key={index} className={styles.amenityItem}>{d}</li>
      ))}
      </ul>
  </div> 

  <div className={styles.amenities}>
      <h2 className={styles.sectionTitle}>Style</h2>
      <ul className={styles.amenitiesList}>
      {venue.style.map((d, index) => (
      <li key={index} className={styles.amenityItem}>{d}</li>
      ))}
      </ul>
  </div>   
  <div className={styles.amenities}>
      <h2 className={styles.sectionTitle}>settings</h2>
      <ul className={styles.amenitiesList}>
      {venue.settings.map((d, index) => (
      <li key={index} className={styles.amenityItem}>{d}</li>
      ))}
      </ul>
  </div>
      
      
      {/* Contact Information */}
      <div className={styles.contactInfo}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <p>Website: <a href={venue.Link} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
          {venue.Name} Website
        </a></p>
        <button className={styles.contactButton} onClick={handleContactClick}>
          Contact Venue
        </button>
      </div>
    </div>
  );
}

export default VenueDetails;

// // components/VenueDetails.js
// import React, { useState } from 'react';
// import styles from './VenueDetails.module.css';
// import img from './img01.jpg'
// import { useParams } from 'react-router-dom';


// function VenueDetails() {

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const { venueData } = useParams();

//   const venue = useState(JSON.parse(decodeURIComponent(venueData)));


//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % venue.images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === 0 ? venue.images.length - 1 : prevIndex - 1
//     );
//   };

//   const handleContactClick = () => {
//     console.log('Contact button clicked for:', venue.Nam);
//     alert(`Contact button clicked for: ${venue.name}! (This will eventually open a contact form or similar)`);
//   };

//   return (
//     <div className={styles.detailsContainer}>
//       <h1 className={styles.name}>{venue.name}</h1>
//       <p className={styles.location}>{venue.location}</p>

//       {/* Image Gallery */}
//       <div className={styles.imageGallery}>
//         {venue.images.map((imageUrl, index) => (
//           <img
//             key={index}
//             src={imageUrl}
//             alt={`Venue ${index + 1}`}
//             className={styles.image}
//             style={{
//               transform: `translateX(-${currentImageIndex * 100}%)`,
//               transition: 'transform 0.3s ease-in-out',
//             }}
//           />
//         ))}
//       </div>
//       <div className={styles.galleryControls}>
//         <button className={styles.galleryButton} onClick={prevImage}>Previous</button>
//         <button className={styles.galleryButton} onClick={nextImage}>Next</button>
//       </div>

//       {/* Description */}
//       <div className={styles.description}>
//         <h2 className={styles.sectionTitle}>About {venue.name}</h2>
//         <p className={styles.descriptionText}>{venue.description}</p>
//       </div>

//       {/* Amenities */}
//       <div className={styles.amenities}>
//         <h2 className={styles.sectionTitle}>Amenities</h2>
//         <ul className={styles.amenitiesList}>
//           {venue.amenities.map((amenity, index) => (
//             <li key={index} className={styles.amenityItem}>{amenity}</li>
//           ))}
//         </ul>
//       </div>

//       {/* Contact Information */}
//       <div className={styles.contactInfo}>
//         <h2 className={styles.sectionTitle}>Contact Us</h2>
//         <p>Phone: {venue.contact.phone}</p>
//         <p>Email: <a href={`mailto:${venue.contact.email}`} className={styles.contactLink}>{venue.contact.email}</a></p>
//         <p>Website: <a href={venue.contact.website} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>{venue.contact.website}</a></p>
//         <button className={styles.contactButton} onClick={handleContactClick}>Contact Venue</button>
//       </div>
//     </div>
//   );
// }

// export default VenueDetails;