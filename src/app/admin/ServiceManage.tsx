"use client"
import React, { useState } from 'react';

import { Trash2, Edit, Eye, Plus, Search, ArrowUpDown, Upload, X, Clock, Star, Calendar } from 'lucide-react';

import { useToast } from "@/src/hooks/use-toast";

import { 

  Dialog,

  DialogContent,

  DialogHeader,

  DialogTitle,

  DialogDescription,

  DialogTrigger,

  DialogFooter,

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

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/src/components/ui/select";

import { Input } from "@/src/components/ui/input";

import { Button } from "@/src/components/ui/button";

import { Card, CardContent } from "@/src/components/ui/card";

import { Textarea } from "@/src/components/ui/textarea";

import {

  Tabs,

  TabsContent,

  TabsList,

  TabsTrigger,

} from "@/src/components/ui/tabs";

import { Badge } from "@/src/components/ui/badge";



// Types

interface Service {

  id: number;

  name: string;

  description: string;

  category: string;

  basePrice: number;

  estimatedTime: string;

  image: string;

  orderCount: number;

  rating: number;

  reviews: Array<{

    userName: string;

    rating: number;

    comment: string;

    date: string;

  }>;

  includes: string[];

  availableDate: string;

  isFeatured: boolean;

}



const ServicesPage = () => {

  const { toast } = useToast();

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [editedService, setEditedService] = useState<Service | null>(null);



  // Sample initial data

  const [services, setServices] = useState<Service[]>([

    {

      id: 1,

      name: "Premium House Cleaning",

      description: "Complete house cleaning service with eco-friendly products",

      category: "Cleaning",

      basePrice: 100,

      estimatedTime: "3 hours",

      image: "/sample-image-1.jpg",

      orderCount: 150,

      rating: 4.5,

      reviews: [

        {

          userName: "John Doe",

          rating: 5,

          comment: "Excellent service!",

          date: "2024-02-15"

        }

      ],

      includes: [

        "Deep cleaning of all rooms",

        "Window cleaning",

        "Floor mopping",

        "Dust removal"

      ],

      availableDate: "Immediate",

      isFeatured: true

    }

  ]);



  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("name");



  // New service form state

  const [newService, setNewService] = useState({

    name: "",

    description: "",

    category: "",

    basePrice: 0,

    estimatedTime: "",

    image: "",

    includes: [] as string[]

  });



  // Handle add service

  const handleAddService = () => {

    const newId = Math.max(...services.map(s => s.id)) + 1;

    setServices([...services, { 

      ...newService, 

      id: newId, 

      orderCount: 0,

      rating: 0,

      reviews: [],

      availableDate: "Immediate",

      isFeatured: false

    }]);

    setAddModalOpen(false);

    toast({

      title: "Success",

      description: "Service added successfully",

      duration: 3000,

    });

  };



  // Handle edit service

  const handleEditService = () => {

    if (editedService) {

      setServices(services.map(s => s.id === editedService.id ? editedService : s));

      setEditModalOpen(false);

      toast({

        title: "Success",

        description: "Service updated successfully",

        duration: 3000,

      });

    }

  };



  // Handle delete service

  const handleDeleteService = (id: number) => {

    setServices(services.filter(service => service.id !== id));

    setDeleteDialogOpen(false);

    toast({

      title: "Success",

      description: "Service deleted successfully",

      duration: 3000,

    });

  };



  // Edit Service Modal

  const EditServiceModal = ({ service }: { service: Service }) => (

    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">

      <DialogHeader>

        <DialogTitle>Edit Service</DialogTitle>

      </DialogHeader>

      <div className="grid gap-4 py-4">

        <div className="grid gap-2">

          <label htmlFor="name" className="font-medium">Service Name</label>

          <Input

            id="name"

            value={editedService?.name}

            onChange={(e) => setEditedService(prev => prev ? {...prev, name: e.target.value} : null)}

            className="w-full"

          />

        </div>

        <div className="grid gap-2">

          <label htmlFor="description" className="font-medium">Description</label>

          <Textarea

            id="description"

            value={editedService?.description}

            onChange={(e) => setEditedService(prev => prev ? {...prev, description: e.target.value} : null)}

            className="w-full"

          />

        </div>

        <div className="grid gap-2">

          <label htmlFor="category" className="font-medium">Category</label>

          <Select

            value={editedService?.category}

            onValueChange={(value) => setEditedService(prev => prev ? {...prev, category: value} : null)}

          >

            <SelectTrigger>

              <SelectValue placeholder="Select Category" />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="cleaning">Cleaning</SelectItem>

              <SelectItem value="outdoor">Outdoor</SelectItem>

              <SelectItem value="repair">Repair</SelectItem>

            </SelectContent>

          </Select>

        </div>

        <div className="grid gap-2">

          <label htmlFor="price" className="font-medium">Base Price</label>

          <Input

            id="price"

            type="number"

            value={editedService?.basePrice}

            onChange={(e) => setEditedService(prev => prev ? {...prev, basePrice: Number(e.target.value)} : null)}

            className="w-full"

          />

        </div>

        <div className="grid gap-2">

          <label htmlFor="time" className="font-medium">Estimated Time</label>

          <Input

            id="time"

            value={editedService?.estimatedTime}

            onChange={(e) => setEditedService(prev => prev ? {...prev, estimatedTime: e.target.value} : null)}

            className="w-full"

          />

        </div>

        <div className="grid gap-2">

          <label htmlFor="image" className="font-medium">Service Image</label>

          <Input

            id="image"

            type="file"

            onChange={(e) => {

              if (e.target.files?.[0]) {

                setEditedService(prev => prev ? {

                  ...prev, 

                  image: URL.createObjectURL(e.target.files![0])

                } : null);

              }

            }}

            className="w-full"

          />

        </div>

      </div>

      <DialogFooter>

        <Button variant="outline" onClick={() => setEditModalOpen(false)}>

          Cancel

        </Button>

        <Button 

          className="bg-black hover:bg-gray-800 text-white"

          onClick={handleEditService}

        >

          Save Changes

        </Button>

      </DialogFooter>

    </DialogContent>

  );



  // View Service Modal

  const ViewServiceModal = ({ service }: { service: Service }) => (

    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">

      <DialogHeader className="relative">

        <DialogTitle className="sr-only">{service.name}</DialogTitle>

        <div className="h-64 w-full relative mb-6">

          <img

            src={service.image || "/placeholder.png"}

            alt={service.name}

            className="h-full w-full object-cover rounded-t-lg shadow-md"

          />

          {service.isFeatured && (

            <Badge className="absolute top-2 left-2 bg-black text-white">Featured</Badge>

          )}

        </div>

      </DialogHeader>



      <div className="px-1">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">{service.name}</h2>

          <span className="text-xl font-semibold">₹{service.basePrice}</span>

        </div>



        <div className="flex flex-wrap items-center gap-4 mb-4">

          <div className="flex items-center">

            <Star className="h-5 w-5 text-yellow-400" />

            <span className="ml-1 font-medium">{service.rating}</span>

          </div>

          <span className="text-gray-600">({service.reviews.length} reviews)</span>

          <div className="flex items-center text-gray-600">

            <Clock className="h-4 w-4 mr-1" />

            <span>{service.estimatedTime}</span>

          </div>

        </div>



        <Tabs defaultValue="details" className="w-full mb-6">

          <TabsList className="w-full bg-gray-100">

            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>

            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>

          </TabsList>

          <TabsContent value="details" className="mt-4">

            <div className="space-y-4">

              <div>

                <h3 className="font-semibold mb-2">Description</h3>

                <p className="text-gray-700">{service.description}</p>

              </div>

              <div>

                <h3 className="font-semibold mb-2">Includes</h3>

                <ul className="list-disc pl-5 space-y-1">

                  {service.includes.map((item, i) => (

                    <li key={i} className="text-gray-700">{item}</li>

                  ))}

                </ul>

              </div>

            </div>

          </TabsContent>

          <TabsContent value="reviews" className="mt-4">

            <div className="space-y-6">

              {service.reviews.length > 0 ? (

                service.reviews.map((review, i) => (

                  <div key={i} className="border-b pb-4 last:border-0">

                    <div className="flex items-center gap-2 mb-2">

                      <div>

                        <h4 className="font-medium">{review.userName}</h4>

                        <div className="flex items-center">

                          {Array.from({ length: 5 }).map((_, idx) => (

                            <Star

                              key={idx}

                              className={`h-3 w-3 ${

                                idx < review.rating

                                  ? "text-yellow-400"

                                  : "text-gray-200"

                              }`}

                            />

                          ))}

                          <span className="text-xs text-gray-500 ml-2">{review.date}</span>

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

      </div>

    </DialogContent>

  );



  return (

    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <h1 className="text-3xl font-bold">Services Management</h1>

        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>

          <DialogTrigger asChild>

            <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">

              <Plus className="w-4 h-4 mr-2" />

              Add New Service

            </Button>

          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">

            <DialogHeader>

              <DialogTitle>Add New Service</DialogTitle>

            </DialogHeader>

            <div className="grid gap-4 py-4">

              <Input

                placeholder="Service Name"

                value={newService.name}

                onChange={(e) => setNewService({ ...newService, name: e.target.value })}

              />

              <Textarea

                placeholder="Description"

                value={newService.description}

                onChange={(e) => setNewService({ ...newService, description: e.target.value })}

              />

              <Select

                onValueChange={(value) => setNewService({ ...newService, category: value })}

              >

                <SelectTrigger>

                  <SelectValue placeholder="Select Category" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="cleaning">Cleaning</SelectItem>

                  <SelectItem value="outdoor">Outdoor</SelectItem>

                  <SelectItem value="repair">Repair</SelectItem>

                </SelectContent>

              </Select>

              <Input

                type="number"

                placeholder="Base Price"

                value={newService.basePrice}

                onChange={(e) => setNewService({ ...newService, basePrice: Number(e.target.value) })}

              />

              <Input

                placeholder="Estimated Time"

                value={newService.estimatedTime}

                onChange={(e) => setNewService({ ...newService, estimatedTime: e.target.value })}

              />

              <Input

                type="file"

                onChange={(e) => {

                  if (e.target.files?.[0]) {

                    setNewService({ ...newService, image: URL.createObjectURL(e.target.files[0]) });

                  }

                }}

              />

            </div>

            <DialogFooter>

              <Button variant="outline" onClick={() => setAddModalOpen(false)}>

                Cancel

              </Button>

              <Button 

                className="bg-black hover:bg-gray-800 text-white"

                onClick={handleAddService}

              >

                Add Service

              </Button>

            </DialogFooter>

          </DialogContent>

        </Dialog>

      </div>

      {/* Search and Sort */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 relative">
              <img
                src={service.image || "/placeholder.png"}
                alt={service.name}
                className="h-full w-full object-cover"
              />
              {service.isFeatured && (
                <Badge className="absolute top-2 left-2 bg-black text-white">
                  Featured
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-500">ID: {service.id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">₹{service.basePrice}</span>
                  <span className="text-gray-600">{service.orderCount} orders</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-gray-100"
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      {selectedService && <ViewServiceModal service={selectedService} />}
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-gray-100"
                      onClick={() => {
                        setSelectedService(service);
                        setEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;