import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const Partners = ({ onOpenModal }) => {
  const [partnersData, setPartnersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const partnersPerPage = 9; // 3 hàng x 3 cột

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/partners");
        setPartnersData(response.data); // API trả về danh sách partners
      } catch (err) {
        setError("Failed to fetch partners");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = partnersData.slice(indexOfFirstPartner, indexOfLastPartner);

  // Thêm các card trống nếu số lượng card không đủ 9
  const paddedPartners = [...currentPartners];
  while (paddedPartners.length < partnersPerPage) {
    paddedPartners.push(null); // Thêm các giá trị null để tạo card trống
  }

  // Tính tổng số trang
  const totalPages = Math.ceil(partnersData.length / partnersPerPage);

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

  const handleViewDetails = (partner) => {
    if (!partner) return; // Không làm gì nếu card là trống
    onOpenModal({
      type: "partner",
      title: partner.name || "No Name Available",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={partner.logo || "/default-logo.jpg"}
              alt={partner.name || "No Name"}
              className="w-20 h-20 rounded-lg object-cover border-2 border-orange-400"
            />
            <div>
              <h3 className="text-2xl font-bold text-white">{partner.name || "No Name Available"}</h3>
              <p className="text-orange-400 font-medium">{partner.industry || "No Industry"}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{partner.location || "No Location"}</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">About</h4>
            <p className="text-gray-300 leading-relaxed">{partner.description || "No Description Available"}</p>
          </div>

          <div className="flex space-x-4 pt-4">
            {partner.website && (
              <a
                href={partner.website}
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
    return <p className="text-center text-gray-300">Loading partners...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section id="partners" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            Our Partners
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the organizations and companies that support our mission and vision.
          </p>
        </div>

        {/* Hiển thị các card */}
        <div className="grid md:grid-cols-3 gap-8">
          {paddedPartners.map((partner, index) => (
            <div
              key={index}
              className={`group bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-between ${
                partner
                  ? "hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-slate-700 hover:border-orange-500/30"
                  : "border border-transparent"
              }`}
            >
              {partner ? (
                <>
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={partner.logo || "/default-logo.jpg"}
                        alt={partner.name || "No Name"}
                        className="w-12 h-12 rounded-lg object-cover border border-orange-400"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{partner.name || "No Name Available"}</h3>
                        <p className="text-orange-400 text-sm font-medium">{partner.industry || "No Industry"}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {partner.description || "No Description Available"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewDetails(partner)}
                    className="mt-auto w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    View Details
                  </button>
                </>
              ) : (
                <div className="h-full" /> // Card trống
              )}
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

export default Partners;