import { create } from "zustand";

// Define TypeScript interface for Address
interface Address {
    id: string;
    houseNo: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    default: boolean;
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
