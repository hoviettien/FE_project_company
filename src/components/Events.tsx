import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Events = ({ onOpenModal }) => {
  const [eventsData, setEventsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardsPerPage = 9; // 3 hàng x 3 card

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/articles");
        setEventsData(response.data); // API trả về danh sách sự kiện
      } catch (err) {
        setError("Failed to fetch events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = eventsData.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(eventsData.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationNumbers = () => {
    const maxVisiblePages = 5; // Số trang hiển thị tối đa
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleViewDetails = (event) => {
    console.log("Event data:", event); // Kiểm tra dữ liệu event
    onOpenModal({
      type: "event",
      title: event.title || "No Title Available",
      content: (
        <div className="space-y-6">
          <div className="relative">
            <img
              src={
                event.image?.startsWith("http")
                  ? event.image
                  : `http://localhost:8000${event.image}`
              }
              alt={event.title || "No Title"}
              className="w-full h-48 object-contain rounded-lg"
            />
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {event.type || "No Type"}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {event.title || "No Title Available"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>{event.date || "No Date"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>{event.time || "No Time"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{event.location || "No Location"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span>{event.attendees || "No Attendees"} attendees</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Description
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {event.fullDescription || "No Description Available"}
            </p>
          </div>

          {event.speakers && event.speakers.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Speakers
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.speakers.map((speaker, index) => (
                  <span
                    key={index}
                    className="bg-slate-700 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {speaker}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    });
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section id="events" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join networking events, workshops, and conferences to connect with
            the startup community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {currentCards.map((event, index) => (
            <div
              key={event.id}
              className="group bg-slate-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-slate-700 hover:border-orange-500/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={
                    event.image
                      ? event.image.startsWith("http")
                        ? event.image
                        : `http://localhost:8000${event.image}`
                      : "/default-image.jpg"
                  }
                  alt={event.title}
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {event.description}
                </p>

                <button
                  onClick={() => handleViewDetails(event)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {/* Nút Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 flex items-center justify-center"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} /> {/* Biểu tượng mũi tên trái */}
          </button>

          {/* Các nút số trang */}
          {getPaginationNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageNumber
                  ? "bg-orange-500 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          {/* Nút Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 flex items-center justify-center"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} /> {/* Biểu tượng mũi tên phải */}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;
