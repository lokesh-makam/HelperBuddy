import { create } from "zustand";

// Define TypeScript interface for Address
interface Address {
  id: string; // Unique identifier for the address
  houseNo: string; // House number or building name
  street: string; // Street address
  city: string; // City name
  state: string; // State or region
  postalCode: string; // Postal/ZIP code
  country: string; // Country name
  default: boolean; // Whether this is the default address (true/false)
  addressType: "HOME" | "OFFICE" | "OTHER"; // Type of address (Home, Office, Other)
}

// Define store state and actions
interface AddressState {
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

// Create Zustand store
export const useAddressStore = create<AddressState>((set) => ({
  addresses: [],

  setAddresses: (addresses) => set({ addresses }),

  addAddress: (address) =>
    set((state) => ({ addresses: [...state.addresses, address] })),

  removeAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((addr) => addr.id !== id),
    })),

  setDefaultAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.map((address) =>
        address.id === id
          ? { ...address, default: true }
          : { ...address, default: false }
      ),
    })),
}));
