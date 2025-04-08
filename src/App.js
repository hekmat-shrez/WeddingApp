import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedVenues from './components/FeaturedVenues';
import SearchFilter from './components/SearchFilter';
import VenuesList from './components/VenueList';
import Footer from './components/Footer';
import PlanningDashboard from './components/PlanningDashboard';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import VenueDetails from './components/VenueDetails';
import VenueList from './components/venues'
import SignIn from './components/LoginIn';
import SignUp from './components/SignUp';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<>
          <HeroSection />
          <FeaturedVenues />
          <SearchFilter />
          <VenuesList />
        </>} />
        <Route path="/planning" element={<>
          <PlanningDashboard />
          </> } />
        <Route path="/DetailVenue/:id"  element={<VenueDetails />} />
        <Route path="/venues" element={<VenueList />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;