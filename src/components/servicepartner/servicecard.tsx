import React, { useEffect, useState } from "react";
import { Star, X, ShoppingCart, Clock, Calendar } from "lucide-react";
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

import { MdOutlineHomeRepairService } from "react-icons/md";
import {
  applyForService,
  removeService,
  withdrawApplication,
} from "@/src/actions/servicepartnerservices";
import { toast } from "react-toastify";

const ServiceCard: React.FC<any> = ({ service, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setstatus] = useState(service.partnerStatus || "null");
  const enrichedService = {
    ...service,
  };
  const handleApplyService = async () => {
    const response = await applyForService(user.id, service.id);
    if (response.success) setstatus("pending");
    if (!response.success) toast.error(response.message);
  };

  const handleWithdraw = async () => {
    const response = await withdrawApplication(user.id, service.id);
    if (response.success) setstatus("null");
    if (!response.success) toast.error(response.message);
  };

  const handleRemoveService = async () => {
    const response = await removeService(user.id, service.id);
    if (response.success) setstatus("null");
    if (!response.success) toast.error(response.message);
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
              <span className="ml-1 text-sm font-medium text-gray-800">
                {enrichedService.averageRating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({enrichedService.approvedReviews.length} reviews)
            </span>
          </div>

          {/* Service Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {enrichedService.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[20px] max-h-[20px]">
            {enrichedService.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              ₹{enrichedService.basePrice}
            </span>
            <span className="text-sm text-gray-500">/ service</span>
          </div>
        </div>
      </div>

      {/* Detailed Service Modal */}
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

            {status !== "null" ? (
              status === "pending" ? (
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              ) : status === "approved" ? (
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
                  onClick={handleRemoveService}
                >
                  Remove Service
                </Button>
              ) : (
                <Button className="w-full bg-black text-white font-medium py-3 disabled">
                  Service Request Rejected
                </Button>
              )
            ) : (
              <Button
                className="w-full bg-blackhover:bg-gray-800 text-white font-medium py-3"
                onClick={handleApplyService}
              >
                <MdOutlineHomeRepairService className="h-5 w-5 mr-2" />
                Apply For Service
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceCard;
