import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="w-full md:w-96 mx-auto">
        <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
    type="text"
    placeholder="Search services..."
    className="block w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    />
    </div>
    </div>
);
};
