"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Star } from "lucide-react";
import { getReviews } from "@/src/actions/review";

interface Review {
  id: string;
  serviceRequestId: string;
  rating: number;
  review: string;
  createdAt: string;
  serviceRequest: {
    user: {
      firstName: string;
      lastName: string;
    };
    service: {
      name: string;
    };
    servicePartner?: {
      fullName: string;
    };
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("All");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await getReviews();
      if (response.success) {
        setReviews(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
        <Star key={index} size={20} className={`${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ));
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
        review.serviceRequest.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceRequest.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceRequest.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.serviceRequest.servicePartner?.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        review.review.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = filterRating === "All" || review.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  });

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Customer Reviews & Feedback</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2"
          />
          <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/4"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                  <Card key={review.id} className="rounded-lg transform transition-all duration-300 hover:shadow-lg max-w-sm bg-white">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-700">
                          User: {review.serviceRequest.user.firstName} {review.serviceRequest.user.lastName}
                        </CardTitle>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-md font-medium text-gray-600">
                          Service: {review.serviceRequest.service.name}
                        </div>
                        <div className="text-md font-medium text-gray-600">
                          Provider: {review.serviceRequest.servicePartner?.fullName || "N/A"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
              ))
          ) : (
              <p className="text-center col-span-full text-gray-600">No reviews found matching your criteria.</p>
          )}
        </div>
      </div>
  );
}
