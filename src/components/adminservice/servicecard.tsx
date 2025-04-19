import React, {useEffect, useState} from "react";
import { Star, Clock, Calendar} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {getReviewsByServiceId} from "@/src/actions/admin";
import Loading from "@/src/app/loading";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";
import {deleteService} from "@/src/actions/adminservice";
import { AnimatePresence, motion } from "framer-motion";
import ServiceForm from "@/src/app/admin/serviceedit";
const ServiceCard: React.FC<any> = ({ service }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviews, setreviews] = useState<any>([]);
    const [avgrating, setavgrating] = useState(0);
    const [display,setdisplay]=useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        async function getreviews() {
            const reviews = await getReviewsByServiceId(service.id);
            const data=reviews?.data?.filter((item: any) => item.status == "true");
            const totalRating = data?.reduce((acc: number, review: any) => acc + review.rating, 0)||0;
            const averageRating = totalRating / (data?.length||1);
            if(reviews?.success){
                setLoading(false);
                setreviews(data);
                setavgrating(averageRating);
            }
        }
        getreviews();
    }, []);
    const handleCloseModal = () => {
        setIsEditOpen(false); // Close the modal
    };
    if(loading){
        return <Loading/>
    }
    const enrichedService = {
        ...service,
        reviews: reviews,
        rating: avgrating,
        duration: service.duration,
        availableDate: service.availableDate || "Today",
        includes: service?.includes?.split(",") || ["Standard package", "Basic support", "One revision"]
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handledelete = async () => {
        const response = await deleteService(service.id);
        if (response.success) {
            toast.success("Service Deleted Successfully.");
            setdisplay(false); // Hide the service card
            setIsModalOpen(false);
        } else {
            toast.error("Error deleting service.");
        }
        setIsConfirmOpen(false); // Close confirmation modal
    };
    if(!display){
        return null;
    }
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
                    <div
                        className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Container */}
                <div className="p-4">
                    {/* Rating and Reviews */}
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                            <span className="ml-1 text-sm font-medium text-gray-800">{enrichedService.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({enrichedService.reviews.length} reviews)</span>
                    </div>

                    {/* Service Name */}
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{enrichedService.name}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 max-h-[20px] min-h-[20px]">{enrichedService.description}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">₹{enrichedService.basePrice}</span>
                        <span className="text-sm text-gray-500">/ service</span>
                    </div>
                </div>
            </div>

            {/* Detailed Service Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-black">
                    <DialogHeader className="relative">
                        <DialogTitle className="sr-only">{enrichedService.name} Details</DialogTitle>
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
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400"/>
                                <span className="ml-1 font-medium">{enrichedService.rating}</span>
                            </div>
                            <span className="text-gray-600">({enrichedService.reviews.length} reviews)</span>
                            <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-1"/>
                                <span>{enrichedService.estimatedTime}</span>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-6">
                            <Calendar className="h-4 w-4 mr-1"/>
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
                                                        <AvatarImage src={review.userAvatar}/>
                                                        <AvatarFallback>
                                                            {review.serviceRequest.user.firstName?.charAt(0).toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium">{review.serviceRequest.user.firstName} {review.serviceRequest.user.lastName}</h4>
                                                        <div className="flex items-center">
                                                            {Array.from({length: 5}).map((_, idx) => (
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
                                {formatDate(review.createdAt.toLocaleDateString())}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 px-4 text-md">{review.review}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No reviews yet</p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                                onClick={() => {
                                    setIsEditOpen(true)
                                    setIsModalOpen(false)
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                                Edit Service
                            </Button>

                            <Button
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                                onClick={() => setIsConfirmOpen(true)}
                            >
                                <MdDelete className="h-5 w-5 mr-2"/>
                                Delete Service
                            </Button>
                        </div>
                        <AnimatePresence>
                            {isConfirmOpen && (
                                <motion.div
                                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                >
                                    <motion.div
                                        className="bg-white rounded-lg shadow-lg p-6 w-[350px] text-center"
                                        initial={{scale: 0.8, opacity: 0}}
                                        animate={{scale: 1, opacity: 1}}
                                        exit={{scale: 0.8, opacity: 0}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
                                        <p className="text-gray-600 mb-4">
                                            This action cannot be undone. This will permanently delete the service.
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <Button
                                                onClick={() => setIsConfirmOpen(false)}
                                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handledelete}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                            >
                                                Yes, Delete
                                            </Button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </DialogContent>
            </Dialog>
            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <ServiceForm onClose={handleCloseModal} service={service}/>
                    </div>
                </div>
            )}
        </>);
};

export default ServiceCard;
