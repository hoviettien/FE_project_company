// App.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Mentors from "./components/Mentors";
import Startups from "./components/Startups";
import Events from "./components/Events";
import Partners from "./components/Partners";
import Statistics from "./components/Statistics";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import SearchBar from "./components/SearchBar";
import BackgroundAnimation from "./components/BackgroundAnimation";
import {
  mentorsData,
  startupsData,
  eventsData,
  partnersData,
} from "./data/mockData";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalContent, setModalContent] = useState(null);
  const [filteredData, setFilteredData] = useState({
    mentors: mentorsData,
    startups: startupsData,
    events: eventsData,
    partners: partnersData,
  });

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    const filterMentors = mentorsData.filter((item) => {
      if (selectedCategory !== "all" && selectedCategory !== "mentors")
        return false;
      return (
        item.name.toLowerCase().includes(query) ||
        item.expertise?.some((exp) => exp.toLowerCase().includes(query)) ||
        item.description?.toLowerCase().includes(query)
      );
    });

    const filterStartups = startupsData.filter((item) => {
      if (selectedCategory !== "all" && selectedCategory !== "startups")
        return false;
      return (
        item.name.toLowerCase().includes(query) ||
        item.industry?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });

    const filterEvents = eventsData.filter((item) => {
      if (selectedCategory !== "all" && selectedCategory !== "events")
        return false;
      return (
        item.title.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });

    const filterPartners = partnersData.filter((item) => {
      if (selectedCategory !== "all" && selectedCategory !== "partners")
        return false;
      return (
        item.name.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });

    setFilteredData({
      mentors: filterMentors,
      startups: filterStartups,
      events: filterEvents,
      partners: filterPartners,
    });
  }, [searchQuery, selectedCategory]);

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  return (
    <div className="relative min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <BackgroundAnimation />
      <Navbar />

      <main>
        <Hero />

        {/* Search bar */}
        <div className="container mx-auto px-4 py-8">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Chỉ render section nếu có kết quả */}
        {filteredData.mentors.length > 0 && (
          <Mentors data={filteredData.mentors} onOpenModal={openModal} />
        )}
        {filteredData.startups.length > 0 && (
          <Startups data={filteredData.startups} onOpenModal={openModal} />
        )}
        {filteredData.events.length > 0 && (
          <Events data={filteredData.events} onOpenModal={openModal} />
        )}
        {filteredData.partners.length > 0 && (
          <Partners data={filteredData.partners} onOpenModal={openModal} />
        )}

        {/* Nếu không có kết quả nào */}
        {filteredData.mentors.length === 0 &&
          filteredData.startups.length === 0 &&
          filteredData.events.length === 0 &&
          filteredData.partners.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              No results found...
            </p>
          )}

        <Statistics />
      </main>

      <Footer />

      {modalContent && <Modal content={modalContent} onClose={closeModal} />}
    </div>
  );
}

export default App;
