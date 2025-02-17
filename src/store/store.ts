import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Define Service Interface
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

// ✅ **Service Slice**
interface ServicesSlice {
    services: Service[];
    setServices: (services: Service[]) => void;
}

// ✅ **Cart Slice (Now includes `clearCart`)**
interface CartSlice {
    cart: Service[];
    addToCart: (service: Service) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;  // ✅ Added `clearCart` inside CartSlice
}

// ✅ **Service Slice Implementation**
const createServicesSlice = (set: any) => ({
    services: [],
    setServices: (services: Service[]) => set({ services }),
});

// ✅ **Cart Slice with Persistence & `clearCart`**
const createCartSlice = persist<CartSlice>(
    (set) => ({
        cart: [],
        addToCart: (service: Service) =>
            set((state) => ({ cart: [...state.cart, service] })),
        removeFromCart: (id: number) =>
            set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
        clearCart: () => set(() => ({ cart: [] })),  // ✅ Integrated `clearCart`
    }),
    {
        name: "cart-storage", // Key for localStorage
        // @ts-ignore
        getStorage: () => localStorage, // ✅ Ensures persistence
    }
);

// ✅ **Create Zustand Store**

export const useBoundStore = create<ServicesSlice & CartSlice>()((...a) => ({
    // @ts-ignore
    ...createServicesSlice(...a),
    ...createCartSlice(...a),
}));
