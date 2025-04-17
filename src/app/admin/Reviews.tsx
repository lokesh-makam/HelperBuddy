"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReviews, updateReviewStatus } from "@/src/actions/review";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "@/src/app/loading";

// Define the Review type
interface Review {
  id: string; // Unique review identifier
  serviceRequestId: string; // ID of the related service request
  serviceRequest: {
    id: string;
    userId: string; // User who made the request
    serviceId: string; // Service ID
    servicePartnerId?: string; // Optional: Service partner assigned
    status: string; // Status of the service request
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    amount: number;
    walletused: number;
    finalamount: number;
    preferredDate?: Date;
    preferredTime?: string;
    acceptedByProvider: boolean;
    acceptedAt?: Date;
    completedAt?: Date;
    completionstatus: string;
    rating?: number; // Optional rating
    review?: string; // Optional review text
    reviewedAt?: Date;
    paymentStatus: string;
    paymentMethod?: string;
    paymentAt?: Date;
    cancellationReason?: string;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    service: {
      id: string;
      name: string;
      description?: string;
      category: string;
      basePrice: number;
      estimatedTime?: string;
      rating?: number;
      imageUrl?: string;
      createdAt: Date;
      updatedAt: Date;
    };
    servicePartner?: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      address: string;
      rating: number;
      totalServicesCompleted: number;
    };
  };
  rating: number; // Review rating (e.g., 1 to 5)
  review: string; // Review text content
  status: string; // Review status ("pending", "approved", etc.)
  createdAt: Date; // Timestamp when the review was created
}

const AdminReviewsPage = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    async function fetchReviews() {
      const reviews = await getReviews();
      if (reviews?.success) {
        // @ts-ignore
        setReviews(reviews?.data || []);
        setloading(false);
      }
    }
    fetchReviews();
  }, []);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // State for the review detail dialog
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState<
    "display" | "hide" | null
  >(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleDisplayToggleConfirm = (
    review: Review,
    action: "display" | "hide"
  ) => {
    setSelectedReview(review);
    setConfirmDialogAction(action);
    setIsConfirmDialogOpen(true);
  };

  // Improved toggle function with API call and error handling
  const toggleReviewDisplay = async () => {
    if (!selectedReview || !confirmDialogAction) return;

    const newStatus = confirmDialogAction === "display";

    try {
      const response = await updateReviewStatus(
        selectedReview.id,
        newStatus ? "true" : "false"
      );

      if (response.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === selectedReview.id
              ? { ...r, status: newStatus ? "true" : "false" }
              : r
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to update review status:", error);
      toast.error("Failed to update review status.");
    } finally {
      setIsConfirmDialogOpen(false);
      setConfirmDialogAction(null);
    }
  };
  // Function to render stars based on rating
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">½</span>}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manage Reviews</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search reviews..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Review ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Service Name</TableHead>
              <TableHead className="hidden md:table-cell">Provider</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-mono text-xs">{review.id}</TableCell>
                <TableCell>
                  {review.serviceRequest.firstName}{" "}
                  {review.serviceRequest.lastName}
                </TableCell>
                <TableCell>{review.serviceRequest.service.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {review.serviceRequest?.servicePartner?.fullName}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(review.createdAt.toLocaleDateString())}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {renderRatingStars(review.rating)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      review.status == "true" ? "destructive" : "secondary"
                    }
                    className={`${
                      review.status == "true"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {review.status == "true" ? "Displayed" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleViewReview(review)}
                      variant="outline"
                      size="sm"
                      className="bg-gray-50 hover:bg-gray-200"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() =>
                        handleDisplayToggleConfirm(
                          review,
                          review.status == "true" ? "hide" : "display"
                        )
                      }
                      variant={review.status == "true" ? "outline" : "default"}
                      size="sm"
                      className={`px-4 py-2 font-medium w-[90px] transition-all rounded-lg ${
                        review.status == "true"
                          ? "text-red-700 border-red-300 hover:bg-red-100 hover:text-red-800" // Red for "Hide"
                          : "text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800" // Blue for "Display"
                      }`}
                    >
                      {review.status == "true" ? "Hide" : "Display"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          <div>
            {selectedReview && (
              <div className="space-y-4">
                <p>
                  <strong>Order ID:</strong> {selectedReview.serviceRequest.id}
                </p>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedReview.serviceRequest.user.firstName}{" "}
                  {selectedReview.serviceRequest.user.lastName}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedReview.serviceRequest.user.email}
                </p>
                <p>
                  <strong>Service:</strong>{" "}
                  {selectedReview.serviceRequest.service.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(selectedReview.createdAt.toLocaleDateString())}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedReview.serviceRequest.phone}
                </p>
                <p>
                  <strong>Rating:</strong> {selectedReview.rating}★
                </p>
                <p>
                  <strong>Detailed Review:</strong> {selectedReview.review}
                </p>
                <div className="flex">
                  <p>
                    <strong>Status:</strong>
                  </p>
                  <Badge
                    variant={
                      selectedReview.status == "true"
                        ? "destructive"
                        : "secondary"
                    }
                    className={`${
                      selectedReview.status == "true"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedReview.status == "true"
                      ? "Displayed to Users"
                      : "Hidden from Users"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialogAction === "display"
                ? "Display this review?"
                : "Hide this review?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialogAction === "display"
                ? "This review will be visible to all users."
                : "This review will be hidden from all users."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={toggleReviewDisplay}
              className={`px-4 py-2 text-white font-medium rounded-lg transition-all ${
                confirmDialogAction === "display"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300" // Blue for "Display"
                  : "bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300" // Red for "Hide"
              }`}
            >
              {confirmDialogAction === "display" ? "Display" : "Hide"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReviewsPage;
