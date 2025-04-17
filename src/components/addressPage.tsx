"use client";
import { useEffect, useState } from "react";
import { Briefcase, Edit, Home, MapPin, Plus, Trash, Check } from "lucide-react";
import Loading from "@/src/app/loading";
import { addAddressdb, editAddressdb, getAddresses, removeAddressdb, setDefaultAddressdb } from "@/src/actions/addresses";
import { useAddressStore } from "@/src/store/addressstore";
import { useUser } from "@clerk/nextjs";

export default function CheckoutAddressSelector() {
    const addresses = useAddressStore((state) => state.addresses);
    const setAddresses = useAddressStore((state) => state.setAddresses);
    const addAddress = useAddressStore((state) => state.addAddress);
    const removeAddress = useAddressStore((state) => state.removeAddress);
    const setDefaultAddress = useAddressStore((state) => state.setDefaultAddress);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string|null>(null);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            getAddresses(user.id).then((data) => {
                setAddresses(data);
                // Set default address as selected if available
                const defaultAddress = data.find(addr => addr.default);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                }
                setLoading(false);
            });
        }
    }, [user]);

    const [isEditing, setIsEditing] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        houseNo: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        default: false,
        addressType: "HOME",
    });

    if (loading) return <Loading />;

    const handleInputChange = (e:any) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === "checkbox";
        setFormData({
            ...formData,
            [name]: isCheckbox ? e.target.checked : value,
        });
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            if (isEditing !== null) {
                const result = await editAdd
                ressdb(isEditing, formData);
                if (result) {
                    removeAddress(isEditing);
                    addAddress(result);
                    if (isEditing===selectedAddressId&&result.default) {
                        setSelectedAddressId(result.id);
                    }else{
                        setSelectedAddressId(null);
                    }
                }
            } else {
                const result = await addAddressdb(formData, user?.id || "");
                if (result) {
                    setAddresses(result);
                    // If this is the first address or it's set as default, select it
                    const newAddress = result.find(addr => addr.default);
                    if (newAddress) {
                        setSelectedAddressId(newAddress.id);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setFormData({
                houseNo: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
                default: false,
                addressType: "HOME",
            });
            setIsAdding(false);
            setIsEditing(null);
        }
    };

    const handleDelete = async (id:any) => {
        const result = await removeAddressdb(id);
        if (result) {
            removeAddress(id);
            if (selectedAddressId === id) {
                // If we deleted the selected address, find a new one to select (default if available)
                setSelectedAddressId( null);
            }
        }
    };


    const handleSelectAddress = async (address:any) => {
        const result = await setDefaultAddressdb(address.id);
        if (result) {
            setDefaultAddress(address.id);
            setSelectedAddressId(address.id);
        }
    };

    const handleEditClick = (address:any) => {
        setIsEditing(address.id);
        setFormData({
            houseNo: address.houseNo,
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            default: address.default,
            addressType: address.addressType,
        });
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            </div>

            {/* Address List */}
            <div className="p-4">
                {addresses.length === 0 && !isAdding && (
                    <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">No saved addresses found</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="inline-flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Address
                        </button>
                    </div>
                )}

                {addresses.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 mb-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                    selectedAddressId === address.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => handleSelectAddress(address)}
                            >
                                <div className="flex justify-between">
                                    <div className="flex items-start gap-3">
                                        {/* Radio button style selection indicator */}
                                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                                            selectedAddressId === address.id
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-gray-300"
                                        } flex items-center justify-center`}>
                                            {selectedAddressId === address.id && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>

                                        <div>
                                            {/* Address Type Badge */}
                                            <div className="flex items-center mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            address.addressType === "HOME" ? "bg-green-100 text-green-800" :
                                address.addressType === "OFFICE" ? "bg-blue-100 text-blue-800" :
                                    "bg-purple-100 text-purple-800"
                        }`}>
                          {address.addressType === "HOME" && <Home className="h-3 w-3 mr-1" />}
                            {address.addressType === "OFFICE" && <Briefcase className="h-3 w-3 mr-1" />}
                            {address.addressType === "OTHER" && <MapPin className="h-3 w-3 mr-1" />}
                            {address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1).toLowerCase()}
                        </span>
                                                {address.default && (
                                                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Default</span>
                                                )}
                                            </div>

                                            {/* Address Details */}
                                            <p className="text-sm text-gray-900 font-medium">
                                                {address.houseNo}, {address.street}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {address.city}, {address.state} {address.postalCode}
                                            </p>
                                            <p className="text-sm text-gray-700">{address.country}</p>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(address);
                                            }}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(address.id);
                                            }}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Address Button (shown only when addresses exist and form is not visible) */}
                {addresses.length > 0 && !isAdding && !isEditing && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center border border-dashed border-gray-300 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                    </button>
                )}

                {/* Add/Edit Address Form */}
                {(isAdding || isEditing !== null) && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-base font-medium mb-3 text-gray-900">
                            {isEditing !== null ? "Edit Address" : "Add New Address"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="houseNo"
                                    placeholder="House No, Building Name"
                                    value={formData.houseNo}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street Address"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="PIN Code"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                />
                                <select
                                    name="addressType"
                                    value={formData.addressType}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg text-sm w-full"
                                    required
                                >
                                    <option value="HOME">Home</option>
                                    <option value="OFFICE">Office</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="default"
                                    checked={formData.default}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 border border-gray-300 rounded accent-blue-500"
                                />
                                <span className="text-sm text-gray-700">Set as default address</span>
                            </label>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        setIsEditing(null);
                                    }}
                                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    {isEditing !== null ? "Save Changes" : "Add Address"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}