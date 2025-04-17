// store/checkout-store.ts
import { create } from "zustand";

export type TimeSlot =
  | "09:00 AM"
  | "10:00 AM"
  | "11:00 AM"
  | "12:00 PM"
  | "01:00 PM"
  | "02:00 PM"
  | "03:00 PM"
  | "04:00 PM"
  | "05:00 PM";

export const TIME_SLOTS: TimeSlot[] = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceDate: Date | null;
  serviceTime: TimeSlot | "";
}

interface CheckoutState {
  formData: FormDataType;
  setFormData: (data: Partial<FormDataType>) => void;
  resetFormData: () => void;
  timeSlots: TimeSlot[];
  setTimeSlots: (slots: TimeSlot[]) => void;
}

const initialFormData: FormDataType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  serviceDate: new Date(), // today by default
  serviceTime: "",
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  formData: initialFormData,
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  resetFormData: () => set({ formData: initialFormData }),
  timeSlots: TIME_SLOTS,
  setTimeSlots: (slots) => set({ timeSlots: slots }),
}));
