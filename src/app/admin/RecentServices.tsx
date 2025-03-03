import { useEffect, useState } from "react";
import { getAllServiceRequests, markServiceCompleted } from "@/src/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import {toast} from "react-toastify";

interface ServiceRequest {
  state: string;
  city: string;
  address: string;
  phone: string;
  id: string;
  status: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string; address: string };
  service: { name: string };
  servicePartner?: { fullName: string; email: string; phone: string; experience: number; rating: number; pendingServices: number };
}

export default function AdminServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      const response = await getAllServiceRequests();
      if (response.success) {
        console.log(response.data);
        setServiceRequests(response.data);
      } else {
        console.error(response.error);
      }
    }
    fetchRequests();
  }, []);

  const handleMarkCompleted = async (id: string) => {
    const response = await markServiceCompleted(id);
    if (response.success) {
      setServiceRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: "Completed" } : req))
      );
    } else {
      console.error(response.error);
      toast.error(response.error);
    }
  };

  return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Service Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceRequests.map((req) => (
              <Card key={req.id} className="rounded-2xl cursor-pointer hover:shadow-2xl">
                <CardHeader>
                  <CardTitle>{req.service.name}</CardTitle>
                  <CardDescription>Status: {req.status}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><strong>User:</strong> {req.user.firstName} {req.user.lastName}</p>
                  <p><strong>Email:</strong> {req.user.email}</p>
                  <p><strong>Phone:</strong> {req.phone}</p>
                  <p><strong>Provider:</strong> {req?.servicePartner?.fullName|| "N/A"}</p>
                  <p><strong>Experience:</strong> {req?.servicePartner?`${req.servicePartner.experience} years`:"N/A"}</p>
                  <p><strong>Order Date:</strong>{new Date(req.createdAt).toLocaleDateString()}</p>

                  <div className="flex gap-2 mt-3">
                    <Button onClick={() => setSelectedService(req)}
                            className="w-1/2 bg-blue-500 text-white hover:bg-blue-700">
                      View Details
                    </Button>
                    {req.status !== "Completed" && (
                        <Button onClick={(e) => {
                          e.stopPropagation();
                          handleMarkCompleted(req.id);
                        }} className="w-1/2 bg-green-500 text-white hover:bg-green-700">
                          Mark as Completed
                        </Button>
                    )}
                  </div>

                </CardContent>
              </Card>
          ))}
        </div>
        {selectedService && (
            <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Service Details</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{selectedService.service.name}</h2>
                  <p><strong>Status:</strong> {selectedService.status}</p>
                  <hr className="my-2" />
                  <h3 className="text-lg font-semibold">User Details</h3>
                  <p><strong>Name:</strong> {selectedService.user.firstName} {selectedService.user.lastName}</p>
                  <p><strong>Email:</strong> {selectedService.user.email}</p>
                  <p><strong>Phone:</strong> {selectedService.phone}</p>
                  <p><strong>Address:</strong> {selectedService.address} {selectedService.city} {selectedService.state}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedService.createdAt).toLocaleDateString()}</p>
                  <p><strong>payment method:</strong> {selectedService.paymentMethod}</p>
                  {selectedService.servicePartner && (
                      <>
                        <hr className="my-2" />
                        <h3 className="text-lg font-semibold">Service Provider</h3>
                        <p><strong>Name:</strong> {selectedService.servicePartner.fullName}</p>
                        <p><strong>Email:</strong> {selectedService.servicePartner.email}</p>
                        <p><strong>Phone:</strong> {selectedService.servicePartner.phone}</p>
                        <p><strong>Experience:</strong> {selectedService.servicePartner.experience} years</p>
                        <p><strong>Rating:</strong> {selectedService.servicePartner.rating} ⭐</p>
                        <p><strong>Pending Services:</strong> {selectedService.servicePartner.pendingServices}</p>
                      </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
        )}
      </div>
  );
}
