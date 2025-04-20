import React, { useEffect, useState } from "react";
import {
  Star,
  X,
  ShoppingCart,
  Clock,
  Calendar,
  CheckCircle,
  Minus,
  ShoppingBag,
  Trash,
  Plus,
} from "lucide-react";
import { useBoundStore } from "@/src/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useToast } from "@/src/hooks/use-toast";
import { getReviewsByServiceId } from "@/src/actions/admin";
import Loading from "@/src/app/loading";
import { useRouter } from "next/navigation";
import { getnooforders } from "@/src/actions/user";
// Updated ServiceCard with fixed issues
// ✅ Service Interface (from Prisma model)
interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  estimatedTime?: string;
  includes?: string;
  imageUrl?: string;
  rating: number;
  averageRating: number;
  totalOrders: number;
  completedOrders: number;
  approvedReviews: {
    id: string;
    rating: number;
    comment?: string;
    serviceRequest: {
      id: string;
      user: any; // Replace with proper user type if needed
      service: any;
      servicePartner: any;
    };
  }[];
}

const ServiceCard: React.FC<any> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cart = useBoundStore((state) => state.cart);
  const addToCart = useBoundStore((state) => state.addToCart);
  const removeFromCart = useBoundStore((state) => state.removeFromCart);
  const [activeButton, setActiveButton] = useState(null);
  const [itemAdded, setItemAdded] = useState(false);
  const router = useRouter();
  const cartItem = cart.find((item) => item.id === service.id);
  useEffect(() => {
    if (cartItem && !itemAdded) {
      setItemAdded(true);
      setTimeout(() => setItemAdded(false), 300);
    }
  }, [cartItem?.quantity]);
  const enrichedService = {
    ...service,
  };
  const handleButtonPress = (button: any) => {
    setActiveButton(button);
    setTimeout(() => setActiveButton(null), 150);
  };
  // ✅ Increase quantity of a service (or add if not in cart)
  const increaseQuantity = (service: Service) => {
    addToCart(service);
  };

  // ✅ Decrease quantity or remove if quantity becomes 0
  const decreaseQuantity = (serviceId: string) => {
    removeFromCart(serviceId);
  };

  // ✅ Completely remove item regardless of quantity (more efficient way)
  const removeItemCompletely = (serviceId: string) => {
    const item = cart.find((item) => item.id === serviceId);
    if (item) {
      // Directly filter out the item in one shot instead of looping
      const updatedCart = cart.filter((i) => i.id !== serviceId);
      useBoundStore.setState({ cart: updatedCart });
    }
  };
  const handleCheckCart = () => {
    console.log("Navigate to cart page");
    setIsModalOpen(false);
    router.push("/services/checkout");
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer group relative overflow-hidden transition-all duration-300 bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg"
      >
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <img
            src={enrichedService.imageUrl || "/placeholder.png"}
            alt={enrichedService.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-800">
                {enrichedService.averageRating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({enrichedService.approvedReviews.length} reviews)
            </span>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {enrichedService.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[40px]">
            {enrichedService.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              ₹{enrichedService.basePrice}
            </span>
            <span className="text-sm text-gray-500">/ service</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full shadow-sm">
          {enrichedService.totalOrders}+ order
          {enrichedService.totalOrders > 1 ? "s" : ""}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-black">
          <DialogHeader className="relative">
            <DialogTitle className="sr-only">
              {enrichedService.name} Details
            </DialogTitle>
            <div className="h-64 w-full relative mb-6">
              <img
                src={enrichedService.imageUrl || "/placeholder.png"}
                alt={enrichedService.name}
                className="h-full w-full object-cover rounded-t-lg shadow-md"
              />
              {enrichedService.isFeatured && (
                <Badge className="absolute top-2 left-2 bg-black text-white">
                  Featured
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="px-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{enrichedService.name}</h2>
              <span className="text-xl font-semibold">
                ₹{enrichedService.basePrice}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">
                  {enrichedService.averageRating}
                </span>
              </div>
              <span className="text-gray-600">
                ({enrichedService.approvedReviews.length} reviews)
              </span>
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
                      {enrichedService.includes
                        .split(",")
                        .map((item: string, i: number) => (
                          <li key={i} className="text-gray-700">
                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  {enrichedService.approvedReviews.length > 0 ? (
                    enrichedService.approvedReviews.map(
                      (review: any, i: number) => (
                        <div key={i} className="border-b pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>
                                {review.serviceRequest.user.firstName
                                  ?.charAt(0)
                                  .toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {review.serviceRequest.user.firstName}{" "}
                                {review.serviceRequest.user.lastName}
                              </h4>
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
                                  {formatDate(
                                    review.createdAt.toLocaleDateString()
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 px-4 text-md">
                            {review.review}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No reviews yet
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {cartItem ? (
              <div
                className={`flex flex-col gap-6 transition-all duration-300 ${
                  itemAdded ? "scale-[1.02]" : "scale-100"
                }`}
              >
                {/* Quantity Controls - Improved with better visual hierarchy */}
                <div className="flex items-center justify-center gap-5">
                  <button
                    className={`bg-gray-100 hover:bg-gray-200 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                      activeButton === "decrease" ? "bg-gray-300 scale-95" : ""
                    }`}
                    onClick={() => {
                      handleButtonPress("decrease");
                      decreaseQuantity(cartItem.id);
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-6 w-6" strokeWidth={2} />
                  </button>

                  <div className="bg-white border border-gray-200 rounded-2xl px-6 py-3 min-w-10 shadow-sm">
                    <span className="text-1xl font-bold text-center block">
                      {cartItem.quantity}
                    </span>
                  </div>

                  <button
                    className={`bg-gray-100 hover:bg-gray-200 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                      activeButton === "increase" ? "bg-gray-300 scale-95" : ""
                    }`}
                    onClick={() => {
                      handleButtonPress("increase");
                      increaseQuantity(cartItem);
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-6 w-6" strokeWidth={2} />
                  </button>
                </div>

                {/* Action Buttons - Improved with better spacing and visual design */}
                <div className="flex flex-row gap-x-3">
                  <button
                    className={`w-1/2 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-3 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 ${
                      activeButton === "cart" ? "bg-gray-800 scale-[0.98]" : ""
                    }`}
                    onClick={() => {
                      handleButtonPress("cart");
                      handleCheckCart();
                    }}
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    View Cart
                  </button>

                  <button
                    className={`w-1/2 bg-white border border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 px-3 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 ${
                      activeButton === "remove" ? "bg-red-50 scale-[0.98]" : ""
                    }`}
                    onClick={() => {
                      handleButtonPress("remove");
                      removeItemCompletely(cartItem.id);
                    }}
                  >
                    <Trash className="h-5 w-5 mr-3" />
                    Remove All
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={`w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-3 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 ${
                  activeButton === "add" ? "bg-gray-800 scale-[0.98]" : ""
                }`}
                onClick={() => {
                  handleButtonPress("add");
                  increaseQuantity(service);
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                Add to Cart
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceCard;
