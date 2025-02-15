import React from "react";
import { SlidersHorizontal } from "lucide-react";
import {Button} from "@/src/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/src/components/ui/sheet";
interface FiltersProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedRating: string;
    setSelectedRating: (rating: string) => void;
    selectedPrice: string;
    setSelectedPrice: (price: string) => void;
}
const categories = [
    "All Products",
    "AC Service",
    "Cleaning",
    "Carpenter",
    "Plumbing",
    "Painting",
    "Electrical",
    "Pest Control",
    "Appliances",
];

const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+"];
const priceRanges = ["All Prices", "Under ₹50", "₹50 - ₹100", "Above ₹100"];

export const Filters: React.FC<FiltersProps> = ({
                                             selectedCategory,
                                             setSelectedCategory,
                                             selectedRating,
                                             setSelectedRating,
                                             selectedPrice,
                                             setSelectedPrice,
                                         }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white/50 backdrop-blur-sm">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Filter Services</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Categories</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant="outline"
                                    className={`justify-start rounded-lg transition-all ${
                                        selectedCategory === category
                                            ? "bg-black text-white hover:bg-black/90"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Rating</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {ratings.map((rating) => (
                                <Button
                                    key={rating}
                                    variant="outline"
                                    className={`justify-start rounded-lg transition-all ${
                                        selectedRating === rating
                                            ? "bg-black text-white hover:bg-black/90"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setSelectedRating(rating)}
                                >
                                    {rating}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Price Range</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {priceRanges.map((price) => (
                                <Button
                                    key={price}
                                    variant="outline"
                                    className={`justify-start rounded-lg transition-all ${
                                        selectedPrice === price
                                            ? "bg-black text-white hover:bg-black/90"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setSelectedPrice(price)}
                                >
                                    {price}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
