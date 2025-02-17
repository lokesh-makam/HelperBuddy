"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const serviceCategories = [
  {
    id: 1,
    title: "Home Cleaning & Maintenance",
    services: [
      { id: 1, title: "Bathroom & Kitchen Cleaning", img: "/images/mai.png", link: "/services" },
      { id: 2, title: "Sofa & Carpet Cleaning", img: "/images/mai.png", link: "/services" },
      { id: 3, title: "Water Purifier Repair", img: "/images/mai.png", link: "/services" },
      { id: 4, title: "Plumbers", img: "/images/mai.png", link: "/services" },
    ]
  },
  {
    id: 2,
    title: "Appliance Repair & Service",
    services: [
      { id: 5, title: "AC Service", img: "/images/mai.png", link: "/services" },
      { id: 6, title: "Washing Machine Repair", img: "/images/mai.png", link: "/services" },
      { id: 7, title: "Refrigerator Repair", img: "/images/mai.png", link: "/services" },
      { id: 8, title: "Microwave Repair", img: "/images/mai.png", link: "/services" },
    ]
  },
  {
    id: 3,
    title: "Technical & Installation",
    services: [
      { id: 9, title: "Electrician", img: "/images/mai.png", link: "/services" },
      { id: 10, title: "Carpenter", img: "/images/mai.png", link: "/services" },
      { id: 11, title: "Chimney Repair", img: "/images/mai.png", link: "/services" },
    ]
  }
];

// Flatten services for search
const allServices = serviceCategories.flatMap(category => 
  category.services.map(service => ({
    ...service,
    category: category.title
  }))
);

const ServiceCard = ({ service }) => (
  <a 
    href={service.link}
    className="block w-[260px] xs:w-[280px] sm:w-[240px] h-[260px] flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden snap-start hover:border-black/50 hover:shadow-lg transition-all duration-300 group"
  >
    <div className="h-[160px] overflow-hidden">
      <img
        src={service.img}
        alt={service.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-4">
      <h4 className="font-medium text-base sm:text-lg text-gray-900 group-hover:text-grey-600 transition-colors duration-300 line-clamp-2">
        {service.title}
      </h4>
    </div>
  </a>
);

const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative max-w-2xl mx-auto mb-8">
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search for services..."
        className="w-full h-12 px-12 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-gray-700 text-base"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);

const ServiceRow = ({ category, filteredServices }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth <= 640 ? 280 : 260;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const services = filteredServices || category.services;
  const needsScrollButtons = services.length > 4;

  if (services.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex justify-between items-center mb-4 px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          {category.title}
        </h3>
        {/* {!filteredServices && (
          <a 
            href="/services" 
            className="text-grey-600 hover:text-grey-900 text-sm sm:text-base font-medium transition-colors"
          >
            See All
          </a>
        )} */}
      </div>
      
      <div className="relative">
        {needsScrollButtons && (
          <button
            className="absolute -left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white p-1.5 sm:p-2 rounded-full shadow-md z-10 hover:scale-110 transition"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {needsScrollButtons && (
          <button
            className="absolute -right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white p-1.5 sm:p-2 rounded-full shadow-md z-10 hover:scale-110 transition"
            onClick={() => scroll("right")}
          >
            <ChevronRight size={24} className="text-black" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function ServiceCategories() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = searchQuery
    ? allServices.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const getFilteredServicesForCategory = (categoryTitle) => {
    return filteredServices?.filter(service => service.category === categoryTitle) || [];
  };

  return (
    <div className="max-w-[1200px] mx-auto py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
        Our Services
      </h2>
      <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
  {/* Search Bar */}
  <SearchBar 
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onClear={() => setSearchQuery("")}
    
  />

  {/* Responsive See All Button */}
  <button 
    onClick={() => window.location.href = "/services"} 
    className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white text-sm sm:text-base font-medium rounded-md transition-all duration-200 hover:bg-gray-900"
  >
    See All
  </button>
</div>

      <div className="space-y-6 sm:space-y-8">
        {serviceCategories.map((category) => (
          <ServiceRow 
            key={category.id} 
            category={category}
            filteredServices={searchQuery ? getFilteredServicesForCategory(category.title) : null}
          />
        ))}
      </div>
      
      {filteredServices?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No services found matching "{searchQuery}"</p>
        </div>
      )}
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 640px) {
          .snap-mandatory {
            scroll-snap-type: x mandatory;
          }
        }
      `}</style>
    </div>
  );
}