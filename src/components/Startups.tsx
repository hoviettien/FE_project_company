import React, { useState, useEffect } from "react";
import { Users, TrendingUp, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const Startups = ({ onOpenModal }) => {
  const [startupsData, setStartupsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startupsPerPage = 9; // 3 hàng x 3 startups

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/startups");
        setStartupsData(response.data); // API trả về danh sách startups
      } catch (err) {
        setError("Failed to fetch startups");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const indexOfLastStartup = currentPage * startupsPerPage;
  const indexOfFirstStartup = indexOfLastStartup - startupsPerPage;
  const currentStartups = startupsData.slice(indexOfFirstStartup, indexOfLastStartup);

  const totalPages = Math.ceil(startupsData.length / startupsPerPage);

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

  const handleViewDetails = (startup) => {
    console.log("Startup data:", startup); // Kiểm tra dữ liệu startup
    onOpenModal({
      type: "startup",
      title: startup.name || "No Name Available",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={startup.logo || "/default-logo.jpg"}
              alt={startup.name || "No Name"}
              className="w-20 h-20 rounded-lg object-cover border-2 border-orange-400"
            />
            <div>
              <h3 className="text-2xl font-bold text-white">{startup.name || "No Name Available"}</h3>
              <p className="text-orange-400 font-medium">{startup.industry || "No Industry"}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{startup.location || "No Location"}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{startup.teamSize || "No Team Size"}</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">About</h4>
            <p className="text-gray-300 leading-relaxed">{startup.fullDescription || "No Description Available"}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Key Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stage:</span>
                  <span className="text-white">{startup.stage || "No Stage"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Funding:</span>
                  <span className="text-orange-400">{startup.funding || "No Funding"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Founded:</span>
                  <span className="text-white">{startup.founded || "No Founded Date"}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {startup.technologies?.length > 0 ? (
                  startup.technologies.map((tech, index) => (
                    <span key={index} className="bg-slate-700 text-orange-400 px-2 py-1 rounded-full text-xs">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No Technologies</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-500 transition-all duration-300">
              Connect
            </button>
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      ),
    });
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading startups...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section id="startups" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            Featured Startups
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover innovative companies that are shaping the future across various industries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentStartups.map((startup, index) => (
            <div
              key={startup.id}
              className="group bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-slate-700 hover:border-orange-500/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={startup.logo || "/default-logo.jpg"}
                  alt={startup.name || "No Name"}
                  className="w-12 h-12 rounded-lg object-cover border border-orange-400"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{startup.name || "No Name Available"}</h3>
                  <p className="text-orange-400 text-sm font-medium">{startup.industry || "No Industry"}</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {startup.description || "No Description Available"}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{startup.location || "No Location"}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{startup.teamSize || "No Team Size"}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{startup.stage || "No Stage"}</span>
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Funding:</span>
                  <span className="text-orange-400 font-medium text-sm">{startup.funding || "No Funding"}</span>
                </div>

                <button
                  onClick={() => handleViewDetails(startup)}
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
            <ChevronLeft size={20} />
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
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Startups;