import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/src/components/ui/sheet";
import { Badge } from "@/src/components/ui/badge";

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
    // Count active filters (excluding "All" options)
    const activeFilterCount = [
        selectedCategory !== "All Products" ? 1 : 0,
        selectedRating !== "All Ratings" ? 1 : 0,
        selectedPrice !== "All Prices" ? 1 : 0,
    ].reduce((sum, current) => sum + current, 0);

    // Reset all filters
    const resetFilters = () => {
        setSelectedCategory("All Products");
        setSelectedRating("All Ratings");
        setSelectedPrice("All Prices");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 bg-white/60 border-gray-200 hover:bg-gray-50"
                    aria-label="Open filters"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="default" className="ml-1 bg-black text-white text-xs h-5 min-w-5 px-1.5">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md border-l overflow-y-auto">
                <SheetHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-semibold">Filter Services</SheetTitle>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="h-8 text-sm text-gray-600 hover:text-black"
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="py-6 space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center justify-between">
                            Categories
                            {selectedCategory !== "All Products" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCategory("All Products")}
                                    className="h-6 text-xs text-gray-500"
                                >
                                    Reset
                                </Button>
                            )}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant="outline"
                                    size="sm"
                                    className={`justify-start text-sm font-normal rounded-lg transition-all ${
                                        selectedCategory === category
                                            ? "bg-black text-white hover:bg-black/90 border-black"
                                            : "hover:bg-gray-50"
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
                        <h3 className="text-sm font-medium mb-3 flex items-center justify-between">
                            Rating
                            {selectedRating !== "All Ratings" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedRating("All Ratings")}
                                    className="h-6 text-xs text-gray-500"
                                >
                                    Reset
                                </Button>
                            )}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {ratings.map((rating) => (
                                <Button
                                    key={rating}
                                    variant="outline"
                                    size="sm"
                                    className={`justify-start text-sm font-normal rounded-lg transition-all ${
                                        selectedRating === rating
                                            ? "bg-black text-white hover:bg-black/90 border-black"
                                            : "hover:bg-gray-50"
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
                        <h3 className="text-sm font-medium mb-3 flex items-center justify-between">
                            Price Range
                            {selectedPrice !== "All Prices" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedPrice("All Prices")}
                                    className="h-6 text-xs text-gray-500"
                                >
                                    Reset
                                </Button>
                            )}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {priceRanges.map((price) => (
                                <Button
                                    key={price}
                                    variant="outline"
                                    size="sm"
                                    className={`justify-start text-sm font-normal rounded-lg transition-all ${
                                        selectedPrice === price
                                            ? "bg-black text-white hover:bg-black/90 border-black"
                                            : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => setSelectedPrice(price)}
                                >
                                    {price}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <SheetFooter className="sm:justify-between border-t pt-4 mt-2">
                    <SheetClose asChild>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                    </SheetClose>

                    <SheetClose asChild>
                        <Button
                            variant="default"
                            className="w-full sm:w-auto bg-black hover:bg-black/90 text-white"
                        >
                            Apply Filters
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};