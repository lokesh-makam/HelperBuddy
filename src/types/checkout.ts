export type Address = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

export type TimeSlot = string;

export type FormData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: "razorpay" | "cod";
  serviceDate: string;
  serviceTime: string;
  addressSource: "saved" | "new";
  selectedAddressId: string;
  saveAddress: boolean;
};
