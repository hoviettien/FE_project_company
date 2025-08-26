import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import biểu tượng mũi tên

const Mentors = ({ onOpenModal }) => {
  const [mentorsData, setMentorsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mentorsPerPage = 9; // 3 hàng x 3 mentors

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/speakers");
        setMentorsData(response.data); // API trả về danh sách mentors
      } catch (err) {
        setError("Failed to fetch mentors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const indexOfLastMentor = currentPage * mentorsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
  const currentMentors = mentorsData.slice(
    indexOfFirstMentor,
    indexOfLastMentor
  );

  const totalPages = Math.ceil(mentorsData.length / mentorsPerPage);

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

  const handleViewDetails = (mentor) => {
    onOpenModal({
      type: "mentor",
      title: mentor.name || "No Name Available",
      content: (
        <div className="space-y-6">
          <div className="relative">
            <img
              src={
                mentor.image_url?.startsWith("http")
                  ? mentor.image_url
                  : `http://localhost:8000${mentor.image_url}`
              }
              alt={mentor.name || "No Name"}
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>

          <div>
            <p className="text-gray-300 leading-relaxed">
              {mentor.detail || "No details available."}
            </p>
          </div>

          {mentor.expertise && mentor.expertise.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-700 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
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
    return <p className="text-center text-gray-300">Loading mentors...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section id="mentors" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            Meet Our Mentors
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn from experienced mentors who are leaders in their fields.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {currentMentors.map((mentor, index) => (
            <div
              key={mentor.id}
              className="group bg-slate-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-slate-700 hover:border-orange-500/30 max-w-[calc(100%-70px)] mx-auto"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={
                    mentor.image_url?.startsWith("http")
                      ? mentor.image_url
                      : `http://localhost:8000${mentor.image_url}`
                  }
                  alt={mentor.name}
                  className="w-full h-72 object-contain group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {mentor.name}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {mentor.detail}
                </p>

                <button
                  onClick={() => handleViewDetails(mentor)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 flex items-center justify-center"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </button>

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

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 flex items-center justify-center"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Mentors;