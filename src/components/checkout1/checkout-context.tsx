"use client"

import {createContext, type ReactNode, useContext, useState} from "react"
import type {Address, TimeSlot} from "@/src/types/checkout"

// Sample data
const SAMPLE_SAVED_ADDRESSES: Address[] = [
  {
    id: "addr1",
    name: "Home",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    isDefault: true,
  },
  {
    id: "addr2",
    name: "Office",
    address: "456 Business Ave",
    city: "New York",
    state: "NY",
    postalCode: "10002",
    isDefault: false,
  },
]

const TIME_SLOTS: TimeSlot[] = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

// Cart items for demo
const CART_ITEMS = [
  {
    id: 1,
    name: "Premium T-Shirt",
    price: 29.99,
    quantity: 2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Designer Jeans",
    price: 89.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
]

interface CheckoutContextType {
  formData: any
  setFormData: any
  savedAddresses: Address[]
  timeSlots: TimeSlot[]
  cartItems: any
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addressType: "",
    paymentMethod: "",
    serviceDate: new Date().toISOString().split("T")[0],
    serviceTime: TIME_SLOTS[0],
    cartTotal: 0,
    tax: 0,
    shippingCost: 0,
    orderTotal: 0,
    walletBalance: 0,
    walletAmountUsed: 0,
    amountToPay: 0,
    useWallet: false,
  })



  const value = {
    formData,
    setFormData,
    savedAddresses: SAMPLE_SAVED_ADDRESSES,
    timeSlots: TIME_SLOTS,
    cartItems: CART_ITEMS,
  }

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  return useContext(CheckoutContext)
}
