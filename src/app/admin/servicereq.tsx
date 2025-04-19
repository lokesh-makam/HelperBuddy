"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Eye, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useUser } from "@clerk/nextjs";
import Loading from "@/src/app/loading";
import { toast } from "react-toastify";
import { Button } from "@/src/components/ui/button";
import {
  approveServicePartnerRequest,
  fetchServicePartnerRequests,
  removeServicePartnerRequest,
} from "@/src/actions/servicepartnerrequest";
interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  estimatedTime?: string;
  rating: number;
  includes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServicePartner {
  id: string;
  userId: string;
  experience: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalServicesCompleted: number;
  rating: number;
  pendingServices: number;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  status: string;
  upi?: string;
  serviceAreas: string;
  idCard?: string;
}

interface ServicePartnerService {
  id: string;
  servicePartner: ServicePartner;
  servicePartnerId: string;
  service: Service;
  serviceId: string;
  status: string;
  createdAt: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (provider: ServicePartnerService) => void;
  actionType: "verify" | "decline" | "remove";
  provider: ServicePartnerService | null;
  loader:any;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, actionType, provider ,loader}) => {
  if (!provider) return null;

  const messages = {
    verify: "Are you sure you want to verify this service partner Request?",
    decline: "Are you sure you want to decline this service partner Request?",
    remove: "Are you sure you want to remove this service partner Request?",
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{messages[actionType]}</p>
          <DialogFooter>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button
                className={
                  actionType === "verify" ? "bg-green-600 hover:bg-green-700" :
                      actionType === "decline" ? "bg-red-600 hover:bg-red-700" :
                          "bg-red-600 hover:bg-red-700"
                }
                onClick={() => onConfirm(provider)}
                disabled={loader}
            >
              {loader?
                  (actionType === "verify")? "✅ Verifying" : actionType === "decline" ? "❌ Declining" : "🗑️ Removing"
                  :
                  actionType === "verify" ? "✅ Verify" : actionType === "decline" ? "❌ Decline" : "🗑️ Remove"
              }

            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

function Invitation() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] =
    useState<ServicePartnerService | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [providers, setproviders] = useState<ServicePartnerService[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"verify" | "decline" | "remove">(
    "verify"
  );
  const [loader,setloader]=useState(false);
  useEffect(() => {
    if (user) {
      const getpartner = async () => {
        const data = await fetchServicePartnerRequests();
        setproviders(data);
        setLoading(false);
      };
      getpartner();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleViewDetails = (provider: ServicePartnerService) => {
    setSelectedOrder(provider);
    setIsDetailsOpen(true);
  };
  const openModal = (
    provider: ServicePartnerService,
    type: "verify" | "decline" | "remove"
  ) => {
    setSelectedOrder(provider);
    setActionType(type);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);


  const handleConfirm = async (provider: ServicePartnerService) => {
    if (actionType === "verify") {
      setloader(true);
      await approveServicePartnerRequest(provider.id);
      setloader(false);
      toast.success("Service partner verified successfully!");
      setproviders((prev) => prev.map((p) => (p.id === provider.id ? { ...p, status: "approved" } : p)));
    }else if (actionType === "decline"||actionType === "remove") {
      setloader(true);
      await removeServicePartnerRequest(provider.id);
      setloader(false);
      if(actionType==="decline") {
        toast.success("Service partner Request declined.");
      }else{
        toast.success("Service partner Request removed.");
      }
      setproviders((prev) => prev.filter((p) => p.id !== provider.id));
    }
    closeModal();
  };


  const sortedProvider = providers.filter(
    (item: ServicePartnerService) => item.status === sortOrder
  );

  const filteredPartners = sortedProvider.filter(
    (partner: ServicePartnerService) => {
      const serviceAreas = partner.servicePartner.serviceAreas
        .toLowerCase()
        .split(",") // Split service areas by comma
        .map((area) => area.trim()); // Trim any extra spaces

      return (
        partner.servicePartner.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        serviceAreas.some((area) => area.includes(searchTerm.toLowerCase())) || // Check each area
        partner.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  if (loading) return <Loading />;

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 md:bg-transparent">
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Service Partners Requests
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full md:w-auto relative">
            <div className="relative flex-grow md:flex-grow-0 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search partner by name"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={sortOrder}
              onValueChange={(value) =>
                setSortOrder((value as "pending") || "approved" || "rejected")
              }
            >
              <SelectTrigger className="w-full md:w-[180px] dark:bg-gray-800">
                <SelectValue placeholder="Sort by Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Request</SelectItem>
                <SelectItem value="approved">Accepted Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium">Provider Id</TableCell>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="font-medium">Contact</TableCell>
                  <TableCell className="font-medium">Service Areas</TableCell>
                  <TableCell className="font-medium">Service Name</TableCell>
                  <TableCell className="font-medium">
                    Registration Date
                  </TableCell>
                  <TableCell className="font-medium">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((provider: ServicePartnerService) => (
                  <TableRow
                    key={provider.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell className="font-medium">{provider.id}</TableCell>
                    <TableCell className="font-medium">
                      {provider.servicePartner.fullName}
                    </TableCell>
                    <TableCell>{provider.servicePartner.phone}</TableCell>
                    <TableCell>
                      {provider.servicePartner.serviceAreas}
                    </TableCell>
                    <TableCell>{provider.service.name}</TableCell>
                    <TableCell>{formatDate(provider.createdAt)}</TableCell>
                    <TableCell className="flex items-center space-x-3">
                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(provider)}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition duration-200"
                      >
                        <Eye size={20} />
                      </button>

                      {/* Verify Button (Only if not approved) */}
                      {provider.status === "pending" && (
                        <button
                          onClick={() => openModal(provider, "verify")}
                          className="px-3 py-1 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                        >
                          Verify
                        </button>
                      )}

                      {/* Decline Button (Only if not rejected) */}
                      {provider.status === "pending" && (
                        <button
                          onClick={() => openModal(provider, "decline")}
                          className="px-3 py-1 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          Decline
                        </button>
                      )}

                      {/* Remove Button (Only if approved) */}
                      {provider.status === "approved" && (
                        <button
                          onClick={() => openModal(provider, "remove")}
                          className="px-3 py-1 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                        >
                          Remove
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl w-full h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg">
          <DialogTitle>Service Partner Details</DialogTitle>{" "}
          {/* Required for accessibility */}
          {selectedOrder && (
            <>
              {/*<h2 className="text-xl font-semibold mb-4 text-gray-700">Service Partner Details</h2>*/}

              {/* Service Partner Details */}
              <p>
                <strong>Partner ID:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Service Partner:</strong>{" "}
                {selectedOrder.servicePartner.fullName}
              </p>
              <p>
                <strong>Service ID:</strong> {selectedOrder.service.id}
              </p>
              <p>
                <strong>Service Offered:</strong> {selectedOrder.service.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.servicePartner.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.servicePartner.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.servicePartner.address}
              </p>

              {/* Status with dynamic class for color */}
              <p>
                <strong>Provider Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-lg text-white ${
                    selectedOrder.servicePartner.status === "approved"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {selectedOrder.servicePartner.status}
                </span>
              </p>

              {/* Experience and Other Information */}
              <p>
                <strong>Experience:</strong>{" "}
                {selectedOrder.servicePartner.experience} years
              </p>
              <p>
                <strong>Total Services Completed:</strong>{" "}
                {selectedOrder.servicePartner.totalServicesCompleted}
              </p>
              <p>
                <strong>Pending Services:</strong>{" "}
                {selectedOrder.servicePartner.pendingServices}
              </p>
              <p>
                <strong>Rating:</strong> ⭐{" "}
                {selectedOrder.servicePartner.rating} / 5
              </p>

              {/* Service Areas */}
              <p>
                <strong>Service Areas:</strong>{" "}
                {selectedOrder.servicePartner.serviceAreas}
              </p>

              {/* Bio and UPI */}
              <p>
                <strong>Bio:</strong>{" "}
                {selectedOrder.servicePartner.bio || "N/A"}
              </p>
              <p>
                <strong>UPI ID:</strong>{" "}
                {selectedOrder.servicePartner.upi || "Not provided"}
              </p>

              {/* Display ID Card if available */}
              {selectedOrder.servicePartner.idCard && (
                <div className="pb-4">
                  <strong>ID Card:</strong>
                  <img
                    src={selectedOrder.servicePartner.idCard}
                    alt="ID Card"
                    className="w-96 h-80 object-cover border rounded-lg shadow-md"
                  />
                  <a
                    href={selectedOrder.servicePartner.idCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    View Full ID Card
                  </a>
                </div>
              )}

              {/* Joined and Last Updated Information */}
              <p>
                <strong>Joined On:</strong>{" "}
                {formatDate(selectedOrder.servicePartner.createdAt)}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {formatDate(selectedOrder.servicePartner.updatedAt)}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        actionType={actionType}
        provider={selectedOrder}
        loader={loader}
      />
    </div>
  );
}

export default Invitation;