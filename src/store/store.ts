import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Service {
    id: string;
    name: string;
    description?: string;
    category: string;
    basePrice: number;
    estimatedTime?: string;
    includes?: string;
    imageUrl?: string;
    rating: number;
    // Enriched fields
    averageRating: number;
    totalOrders: number;
    completedOrders: number;
    approvedReviews: {
        id: string;
        rating: number;
        comment?: string;
        serviceRequest: {
            id: string;
            user: any; // Replace with proper user type if needed
            service: any;
            servicePartner: any;
        };
    }[];
}

// ✅ Cart Item Interface
interface CartItem extends Service {
  quantity: number;
}

// ✅ Services Slice
interface ServicesSlice {
  services: Service[];
  setServices: (services: Service[]) => void;
}

// ✅ Cart Slice (only 2 main functions)
interface CartSlice {
  cart: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void; // ← add this
  clearCart: () => void;
}

// ✅ Services Slice Implementation
const createServicesSlice = (set: any) => ({
  services: [],
  setServices: (services: Service[]) => set({ services }),
});

// ✅ Cart Slice Implementation
const createCartSlice = persist<CartSlice>(
  (set) => ({
    cart: [],
    addToCart: (service: Service) =>
      set((state) => {
        const existing = state.cart.find((item) => item.id === service.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === service.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return {
            cart: [...state.cart, { ...service, quantity: 1 }],
          };
        }
      }),
    removeFromCart: (id: string) =>
      set((state) => {
        const existing = state.cart.find((item) => item.id === id);
        if (!existing) return state;

        if (existing.quantity === 1) {
          return {
            cart: state.cart.filter((item) => item.id !== id),
          };
        } else {
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          };
        }
      }),
    deleteFromCart: (
      id: string // ← new function here
    ) =>
      set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),
    clearCart: () => set(() => ({ cart: [] })),
  }),
  {
    name: "cart-storage",
    // @ts-ignore
    getStorage: () => localStorage,
  }
);

// ✅ Combined Zustand Store
export const useBoundStore = create<ServicesSlice & CartSlice>()((...a) => ({
  // @ts-ignore
  ...createServicesSlice(...a),
  ...createCartSlice(...a),
}));
