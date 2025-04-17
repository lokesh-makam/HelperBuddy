"use client";
import {useEffect, useState} from "react";
import {Briefcase, Edit, Home, MapPin, Plus, Trash} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/src/app/loading";
import {addAddressdb, editAddressdb, getAddresses, removeAddressdb, setDefaultAddressdb} from "@/src/actions/addresses";
import {useAddressStore} from "@/src/store/addressstore";
import {useUser} from "@clerk/nextjs";

export default function AddressPage() {
  const addresses=useAddressStore((state) => state.addresses);
  const setAddresses = useAddressStore((state) => state.setAddresses);
  const addAddress=useAddressStore((state) => state.addAddress);
  const removeaddress=useAddressStore((state) => state.removeAddress);
  const setDefaultAddress=useAddressStore((state) => state.setDefaultAddress);
  const [loading, setLoading] = useState(true);
  const {user}=useUser();
  useEffect(() => {
   if(user) {
   getAddresses(user.id).then((data) => {
     setAddresses(data);
     setLoading(false);
   })
   }
  }, [user]);
  const [isEditing, setIsEditing] = useState< string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    default: false,
    addressType: "HOME", // ✅ New field
  });

  if(loading) return <Loading/>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    });
  };



  // Handle form submission (add/edit address)
  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          if (isEditing !== null) {
            const result = await editAddressdb(isEditing, formData);
            if (result) {
              removeaddress(isEditing);
              addAddress(result);
            }
          } else {
            console.log(formData);
            const result = await addAddressdb(formData, user?.id || "");
            if (result) {
              setAddresses(result);
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
            addressType: "HOME", // Reset the addressType to "HOME" after form submission
          });
          setIsAdding(false);
          setIsEditing(null);
        }
      }
  ;

  const handleDelete = async (id: string) => {
    const result = await removeAddressdb(id);
    if (result) {
      removeaddress(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddressdb(id);
    if(result){
      setDefaultAddress(id);
    }
  };

  return (
    <div className="p-6 md:p-10 ">
      <h1 className="text-2xl font-bold mb-6 text-black">Manage Addresses</h1>

      {/* Add Address Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="mb-6 flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Address
      </button>

      {/* Add/Edit Address Form */}
      {(isAdding || isEditing !== null) && (
        <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-black">
            {isEditing !== null ? "Edit Address" : "Add New Address"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                  type="text"
                  name="houseNo"
                  placeholder="House No, Building Name"
                  value={formData.houseNo}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  required
              />
              <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  required
              />
              <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  required
              />
              <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  required
              />
              <input
                  type="text"
                  name="postalCode"
                  placeholder="PIN Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  required
              />
              <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  required
              />
              <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
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
                  className="h-5 w-5 border border-gray-300 rounded"
              />
              <span className="text-black">Set as default address</span>
            </label>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                }}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {isEditing !== null ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-6">

        {addresses.map((address) => (
            <div
                key={address.id}
                className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
            >
              <div className="space-y-2">
                {/* Address Type with Icon */}
                <div className="flex items-center space-x-2 font-semibold text-black">
                  {address.addressType === "HOME" && <Home className="h-5 w-5"/>}
                  {address.addressType === "OFFICE" && <Briefcase className="h-5 w-5"/>}
                  {address.addressType === "OTHER" && <MapPin className="h-5 w-5"/>}
                  <span className="capitalize">{address.addressType}</span>
                  {address.default && (
                      <span className="ml-2 text-sm text-gray-600">(Default)</span>
                  )}
                </div>

                {/* Address Details */}
                <p className="text-black">
                  {address.houseNo}, {address.street}
                </p>
                <p className="text-black">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-black">{address.country}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <button
                    onClick={() => setIsEditing(address.id)}
                    className="flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-200 shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-1"/>
                  Edit
                </button>

                <button
                    onClick={() => handleDelete(address.id)}
                    className="flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-200 shadow-sm"
                >
                  <Trash className="h-4 w-4 mr-1"/>
                  Delete
                </button>

                {!address.default && (
                    <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-200 shadow-sm"
                    >
                      Set as Default
                    </button>
                )}
              </div>
            </div>
        ))}

      </div>
    </div>
  );
}