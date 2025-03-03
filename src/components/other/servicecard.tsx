import React, { useState } from "react";
import { Star, X, ShoppingCart, Clock, Calendar, CheckCircle } from "lucide-react";
import { useBoundStore } from "@/src/store/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useToast } from "@/src/hooks/use-toast";

// Mock review data that will be used until backend data is ready
const mockReviews = [
    {
        id: 1,
        userName: "Rohit S.",
        userAvatar: null,
        rating: 5,
        date: "3 days ago",
        comment: "Excellent service! Exactly what I needed and delivered on time."
    },
    {
        id: 2,
        userName: "Priya M.",
        userAvatar: null,
        rating: 4,
        date: "1 week ago",
        comment: "Very good service. Would recommend, but took slightly longer than expected."
    },
    {
        id: 3,
        userName: "Ankit G.",
        userAvatar: null,
        rating: 5,
        date: "2 weeks ago",
        comment: "High quality work. The provider was very professional and accommodating to my requests."
    },
    {
        id: 4,
        userName: "Divya K.",
        userAvatar: null,
        rating: 3,
        date: "1 month ago",
        comment: "Service was decent. Some improvements could be made but overall satisfied."
    }
];

// Updated ServiceCard with fixed issues
const ServiceCard: React.FC<any> = ({ service }) => {
    const { cart, addToCart, removeFromCart } = useBoundStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isInCart = cart.some((item: { id: any }) => item.id === service.id);
    const { toast } = useToast();
    // Enrich service with mock reviews if it doesn't have any
    const enrichedService = {
        ...service,
        reviews: service.reviews?.length > 0 ? service.reviews : mockReviews,
        rating: service.rating || 4.5,
        duration: service.duration || "1 hour",
        availableDate: service.availableDate || "Today",
        includes: service.includes || ["Standard package", "Basic support", "One revision"]
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening modal when clicking the button

        if (!isInCart) {
            addToCart(enrichedService);
            toast({
                title: "Added to cart!",
                description: `${enrichedService.name} has been added to your cart`,
                variant: "default",
            });
        } else {
            removeFromCart(enrichedService.id);
            toast({
                title: "Removed from cart",
                description: `${enrichedService.name} has been removed from your cart`,
                variant: "destructive",
            });
        }
    };

    const handleCheckCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Navigate to cart page - you'll need to implement this according to your routing setup
        // For example: router.push('/cart') if using Next.js
        console.log("Navigate to cart page");
        setIsModalOpen(false);
    };

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer group relative overflow-hidden transition-all duration-300 bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg"
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                    <img
                        src={enrichedService.imageUrl || "/placeholder.png"}
                        alt={enrichedService.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Container */}
                <div className="p-4">
                    {/* Rating and Reviews */}
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-gray-800">{enrichedService.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({enrichedService.reviews.length} reviews)</span>
                    </div>

                    {/* Service Name */}
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{enrichedService.name}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[40px]">{enrichedService.description}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">₹{enrichedService.basePrice}</span>
                        <span className="text-sm text-gray-500">/ service</span>
                    </div>


                </div>

                {/* Floating Badge (Optional) */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                    Popular
                </div>
            </div>

            {/* Detailed Service Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-black">
                    <DialogHeader className="relative">
                        <DialogTitle className="sr-only">{enrichedService.name} Details</DialogTitle>
                        {/* <Button
              variant="ghost"
              className="absolute top-0 right-0 rounded-full p-2 z-10"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </Button> */}
                        <div className="h-64 w-full relative mb-6">
                            <img
                                src={enrichedService.imageUrl || "/placeholder.png"}
                                alt={enrichedService.name}
                                className="h-full w-full object-cover rounded-t-lg shadow-md"
                            />
                            {enrichedService.isFeatured && (
                                <Badge className="absolute top-2 left-2 bg-black text-white">Featured</Badge>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="px-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{enrichedService.name}</h2>
                            <span className="text-xl font-semibold">₹{enrichedService.basePrice}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 font-medium">{enrichedService.rating}</span>
                            </div>
                            <span className="text-gray-600">({enrichedService.reviews.length} reviews)</span>
                            <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{enrichedService.estimatedTime}</span>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-6">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Available from: {enrichedService.availableDate}</span>
                        </div>

                        <DialogDescription className="text-black/80 leading-relaxed mb-6">
                            {enrichedService.description}
                        </DialogDescription>

                        <Tabs defaultValue="details" className="w-full mb-6">
                            <TabsList className="w-full bg-gray-100">
                                <TabsTrigger value="details" className="flex-1">
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="flex-1">
                                    Reviews
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="mt-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Includes</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {enrichedService.includes.map((item: string, i: number) => (
                                                <li key={i} className="text-gray-700">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {enrichedService.additionalInfo && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Additional Information</h3>
                                            <p className="text-gray-700">{enrichedService.additionalInfo}</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="reviews" className="mt-4">
                                <div className="space-y-6">
                                    {enrichedService.reviews.length > 0 ? (
                                        enrichedService.reviews.map((review: any, i: number) => (
                                            <div key={i} className="border-b pb-4 last:border-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={review.userAvatar} />
                                                        <AvatarFallback>
                                                            {review.userName?.charAt(0) || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium">{review.userName}</h4>
                                                        <div className="flex items-center">
                                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                                <Star
                                                                    key={idx}
                                                                    className={`h-3 w-3 ${
                                                                        idx < review.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "fill-gray-200 text-gray-200"
                                                                    }`}
                                                                />
                                                            ))}
                                                            <span className="text-xs text-gray-500 ml-2">
                                {review.date}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No reviews yet</p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {isInCart ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3"
                                    onClick={handleCheckCart}
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Check Cart
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3"
                                    onClick={handleAddToCart}
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    Remove from Cart
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ServiceCard;