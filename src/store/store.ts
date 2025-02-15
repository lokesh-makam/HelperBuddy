import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware"; // Import persist middleware

// ✅ Define Service Type
interface Service {
    id: number;
    name: string;
    reviews: number;
    rating: number;
    description: string;
    image: string;
    category: string;
    basePrice: number;
}

// ✅ Define Zustand Store Slices
interface ServicesSlice {
    services: Service[];
    setServices: (services: Service[]) => void;
}

interface CartSlice {
    cart: Service[];
    addToCart: (service: Service) => void;
    removeFromCart: (id: number) => void;
}

interface SharedSlice {
    clearCart: () => void;
}

// ✅ **Service Slice**
const createServicesSlice: StateCreator<
    ServicesSlice & CartSlice & SharedSlice,
    [],
    [],
    ServicesSlice
> = (set) => ({
    services: [],
    setServices: (services: Service[]) => set({ services }),
});

// ✅ **Cart Slice with Persistence**
// @ts-ignore
const createCartSlice: StateCreator<
    ServicesSlice & CartSlice & SharedSlice,
    [],
    [],
    CartSlice
> = persist(
    (set) => ({
        cart: [],
        addToCart: (service: Service) =>
            set((state) => ({ cart: [...state.cart, service] })),
        removeFromCart: (id: number) =>
            set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
    }),
    {
        name: "cart-storage", // Key for localStorage
        // @ts-ignore
        getStorage: () => localStorage, // ✅ Corrected property name
    }
);

// ✅ **Shared Slice**
const createSharedSlice: StateCreator<
    ServicesSlice & CartSlice & SharedSlice,
    [],
    [],
    SharedSlice
> = (set) => ({
    clearCart: () => set(() => ({ cart: [] })), // Ensure `cart` is reset properly
});

// ✅ **Create Zustand Store**
export const useBoundStore = create<ServicesSlice & CartSlice & SharedSlice>()(
    (...a) => ({
        ...createServicesSlice(...a),
        ...createCartSlice(...a),
        ...createSharedSlice(...a),
    })
);
