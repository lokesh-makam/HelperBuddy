import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {useBoundStore} from "@/src/store/store";

const ServiceCard: React.FC<any> = ({ service }) => {
    const { cart, addToCart, removeFromCart } = useBoundStore();
    const isInCart = cart.some((item: { id: any; }) => item.id === service.id);
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border border-white/20">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={service.imageUrl || "/placeholder.png"}
                    alt={service.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 fill-black text-black" />
                        <span className="ml-1 text-sm font-medium">{service.rating || 0}</span>
                    </div>
                    <span className="text-sm text-gray-500">({service.reviews || 0} reviews)</span>
                </div>

                <h3 className="font-medium text-base mb-1">{service.name}</h3>

                {/* Fixed height for description */}
                <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[40px]">{service.description}</p>

                <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-700">₹{service.basePrice}</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className={`w-full text-white ${isInCart ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-800"}`}
                    onClick={() => (isInCart ? removeFromCart(service.id) : addToCart(service))}
                >
                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ServiceCard;
