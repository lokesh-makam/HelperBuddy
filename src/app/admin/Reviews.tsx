"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/src/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription 
} from '@/src/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Search } from 'lucide-react';

// Define the Review type
interface Review {
  id: string;
  userName: string;
  serviceName: string;
  serviceProvider: string;
  date: string;
  rating: number;
  comment: string;
  isDisplayed: boolean;
}

const AdminReviewsPage = () => {
  const router = useRouter();
  
  // Sample data - in a real app this would come from an API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-001',
      userName: 'John Doe',
      serviceName: 'Hair Cut',
      serviceProvider: 'Style Studio',
      date: '2025-02-15',
      rating: 4.5,
      comment: 'Great service, very professional. The stylist was friendly and understood exactly what I wanted.',
      isDisplayed: true
    },
    {
      id: 'rev-002',
      userName: 'Jane Smith',
      serviceName: 'Manicure',
      serviceProvider: 'Nail Palace',
      date: '2025-02-14',
      rating: 3.0,
      comment: 'Service was okay but took longer than expected. The end result was satisfactory.',
      isDisplayed: false
    },
    {
      id: 'rev-003',
      userName: 'Mike Johnson',
      serviceName: 'Massage Therapy',
      serviceProvider: 'Relax Spa',
      date: '2025-02-10',
      rating: 5.0,
      comment: 'Absolutely phenomenal experience! The massage therapist was skilled and attentive. Will definitely come back.',
      isDisplayed: true
    },
    {
      id: 'rev-004',
      userName: 'Sarah Williams',
      serviceName: 'Facial Treatment',
      serviceProvider: 'Glow Beauty',
      date: '2025-02-08',
      rating: 2.5,
      comment: "Disappointed with the service. The treatment room wasn't clean and the esthetician seemed rushed.",
      isDisplayed: false
    },
    {
      id: 'rev-005',
      userName: 'Robert Brown',
      serviceName: 'Beard Trim',
      serviceProvider: 'Modern Barber',
      date: '2025-02-05',
      rating: 4.0,
      comment: 'Good service and atmosphere. The barber was skilled but the wait time was a bit long.',
      isDisplayed: true
    },
  ]);

  // State for the review detail dialog
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // State for confirmation dialogs
  const [confirmDialogAction, setConfirmDialogAction] = useState<'display' | 'hide' | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Function to handle view button click
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  // Function to handle display/hide button click
  const handleDisplayToggleConfirm = (reviewId: string, action: 'display' | 'hide') => {
    const review = reviews.find(rev => rev.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setConfirmDialogAction(action);
      setIsConfirmDialogOpen(true);
    }
  };

  // Function to toggle review display status
  const toggleReviewDisplay = () => {
    if (selectedReview && confirmDialogAction) {
      const newDisplayStatus = confirmDialogAction === 'display';
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id 
          ? {...review, isDisplayed: newDisplayStatus} 
          : review
      );
      setReviews(updatedReviews);
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
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">½</span>}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Manage Reviews</h1>
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search reviews..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Responsive table with horizontal scrolling on small screens */}
      <div className="overflow-x-auto rounded-lg border shadow">
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
                <TableCell>{review.userName}</TableCell>
                <TableCell>{review.serviceName}</TableCell>
                <TableCell className="hidden md:table-cell">{review.serviceProvider}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(review.date).toLocaleDateString()}</TableCell>
                <TableCell className="hidden lg:table-cell">{renderRatingStars(review.rating)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={review.isDisplayed ? "success" : "destructive"}
                    className={`${review.isDisplayed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {review.isDisplayed ? 'Displayed' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    onClick={() => handleViewReview(review)} 
                    variant="outline" 
                    size="sm"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleDisplayToggleConfirm(
                      review.id, 
                      review.isDisplayed ? 'hide' : 'display'
                    )}
                    variant={review.isDisplayed ? "destructive" : "secondary"}
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    {review.isDisplayed ? 'Hide' : 'Display'}
                  </Button>
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
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h3 className="font-medium">{selectedReview.serviceName}</h3>
                  <p className="text-sm text-gray-500">by {selectedReview.serviceProvider}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  {renderRatingStars(selectedReview.rating)}
                  <p className="text-sm text-gray-500">{new Date(selectedReview.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Customer:</p>
                <p>{selectedReview.userName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Review:</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.comment}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Status:</p>
                <Badge 
                  variant={selectedReview.isDisplayed ? "success" : "destructive"}
                  className={`${selectedReview.isDisplayed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {selectedReview.isDisplayed ? 'Displayed to Users' : 'Hidden from Users'}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <div className="flex space-x-2 mt-4 sm:mt-0">
              {selectedReview && (
                <Button
                  onClick={() => handleDisplayToggleConfirm(
                    selectedReview.id, 
                    selectedReview.isDisplayed ? 'hide' : 'display'
                  )}
                  variant={selectedReview.isDisplayed ? "destructive" : "secondary"}
                >
                  {selectedReview.isDisplayed ? 'Hide Review' : 'Display Review'}
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialogAction === 'display' ? 'Display this review?' : 'Hide this review?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialogAction === 'display' 
                ? 'This will make the review visible to all users on the platform.' 
                : 'This will hide the review from all users on the platform.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={toggleReviewDisplay}>
              {confirmDialogAction === 'display' ? 'Yes, Display' : 'Yes, Hide'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReviewsPage;