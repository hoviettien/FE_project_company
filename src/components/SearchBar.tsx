// SearchBar.jsx
import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const categories = [
  { value: "all", label: "Tất cả" },
  { value: "speakers", label: "Speakers" },
  { value: "startups", label: "Startups" },
  { value: "events", label: "Events" },
  { value: "partners", label: "Partners" },
];


  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search mentors, startups, events, or partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-white pl-11 pr-4 py-3 rounded-lg 
                       border border-slate-600 
                       focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 
                       outline-none transition-all duration-200
                       placeholder:text-gray-400"
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full lg:w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 text-white pl-11 pr-8 py-3 rounded-lg 
                       border border-slate-600 
                       focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 
                       outline-none transition-all duration-200
                       appearance-none cursor-pointer"
          >
            {categories.map((category) => ( 
              <option key={category.value} value={category.value} className="bg-slate-900">
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
