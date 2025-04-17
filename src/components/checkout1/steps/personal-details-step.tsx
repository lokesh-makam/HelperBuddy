"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useCheckout } from "@/src/components/checkout1/checkout-context";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { useAddressStore } from "@/src/store/addressstore";

import { CalendarDays } from "lucide-react";
import {
    User,
    Mail,
    Phone,
    ArrowRight,
    AlertCircle,
    Info
} from "lucide-react";
import AddressPage from "@/src/components/addressPage";
import DatePicker from "react-datepicker";
import {useUser} from "@clerk/nextjs";
import Loading from "@/src/app/loading";
interface FormDataType {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    houseNo: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: string;
    paymentMethod: string;
    serviceDate: Date | null;
    serviceTime: string;
}

export default function PersonalDetailsStep({
                                                setStep,
                                            }: {
    setStep: (step: number) => void;
}) {
    const { formData, setFormData, timeSlots } = useCheckout() as {
        formData: FormDataType;
        setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
        timeSlots: string[];
    };
    const {user}=useUser();
    const [loading,setloading]=useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Mark field as touched when user interacts with it
        setTouched(prev => ({ ...prev, [name]: true }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formData[name as keyof typeof formData]);
    };

    const validateField = (name: string, value: any) => {
        let error = "";

        if (!value) {
            error = `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`;
        } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Please enter a valid email address";
        } else if (name === "phone" && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
            error = "Please enter a valid phone number";
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const validatePersonalDetails = () => {
        const { firstName, lastName, email, phone, serviceDate, serviceTime } = formData;
        const fields = { firstName, lastName, email, phone, serviceDate, serviceTime };

        let isValid = true;
        const newErrors: Record<string, string> = {};
        const newTouched: Record<string, boolean> = {};

        // Validate all fields
        Object.entries(fields).forEach(([key, value]) => {
            newTouched[key] = true;
            const fieldValid = validateField(key, value);
            if (!fieldValid) {
                isValid = false;
            }
        });

        setTouched(newTouched);

        return isValid;
    };
    const validateDefaultAddress = (): boolean => {
        const { addresses } = useAddressStore.getState()
        const defaultAddress = addresses.find((address) => address.default)

        if (!defaultAddress) {
            toast.error("Please select an address before proceeding.")
            return false
        }
        if (setFormData) {
            setFormData((prev: any) => ({
                ...prev,
                houseNo: defaultAddress.houseNo || "",
                streetAddress: defaultAddress.street || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                postalCode: defaultAddress.postalCode || "",
                country: defaultAddress.country || "",
                addressType: defaultAddress.addressType || "",
            }))
        }
        return true
    }

    const handleContinueToPayment = () => {
        if(!validateDefaultAddress()) return;
        if (validatePersonalDetails()) {
            toast.success("Personal details verified successfully!");
            setStep(2);
        } else {
            const firstErrorField = Object.keys(errors).find(key => errors[key]);
            if (firstErrorField) {
                const element = document.getElementById(firstErrorField);
                if (element) {
                    element.focus();
                }
            }
        }
    };
    const handleDateChange = (date: Date | null) => {
        setFormData(prev => ({ ...prev, serviceDate: date }));
        setTouched(prev => ({ ...prev, serviceDate: true }));
        if (errors.serviceDate) {
            setErrors(prev => ({ ...prev, serviceDate: "" }));
        }
    };
    const handleDateBlur = () => {
        validateField("serviceDate", formData.serviceDate);
        setTouched(prev => ({ ...prev, serviceDate: true }));
    };
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user?.emailAddresses[0]?.emailAddress || "",
                userId: user?.id
            }));
            setloading(false);
        }
    }, [user]);

    if(loading) return <Loading/>;

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <User size={18} className="mr-2 text-blue-600" /> Personal Information
                    </h2>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName" className="text-sm text-gray-700 mb-1 block flex items-center">
                                First Name <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Enter your first name"
                                required
                                aria-required="true"
                                aria-invalid={!!errors.firstName}
                                className={`p-2 border ${errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            />
                            {errors.firstName && touched.firstName && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" /> {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="lastName" className="text-sm text-gray-700 mb-1 block flex items-center">
                                Last Name <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Enter your last name"
                                required
                                aria-required="true"
                                aria-invalid={!!errors.lastName}
                                className={`p-2 border ${errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            />
                            {errors.lastName && touched.lastName && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" /> {errors.lastName}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-sm text-gray-700 mb-1 block flex items-center">
                                <Mail size={16} className="mr-1 text-blue-600" /> Email Address <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                disabled={true}
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="your@email.com"
                                required
                                aria-required="true"
                                aria-invalid={!!errors.email}
                                className={`p-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                autoComplete="email"
                            />
                            {errors.email && touched.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" /> {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone" className="text-sm text-gray-700 mb-1 block flex items-center">
                                <Phone size={16} className="mr-1 text-blue-600" /> Phone Number <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="8341976576"
                                required
                                aria-required="true"
                                aria-invalid={!!errors.phone}
                                className={`p-2 border ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                autoComplete="tel"
                            />
                            {errors.phone && touched.phone && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" /> {errors.phone}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Info size={12} className="mr-1" /> We'll only use this to contact you about your order
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <AddressPage />

            {/* Delivery Schedule Section */}

            <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <CalendarDays size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Delivery Schedule</h2>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Date Picker */}
                        <div className="w-full">
                            <label
                                htmlFor="serviceDate"
                                className="text-sm font-medium text-gray-700 flex items-center mb-2"
                            >
                                <CalendarDays size={16} className="text-blue-600 mr-2" />
                                Select Date <span className="text-red-500 ml-1">*</span>
                            </label>

                            <DatePicker
                                id="serviceDate"
                                selected={formData.serviceDate}
                                onChange={handleDateChange}
                                onBlur={handleDateBlur}
                                minDate={new Date(today)}
                                placeholderText="Choose a date"
                                dateFormat="yyyy-MM-dd"
                                className={`w-full px-3 py-2 rounded-lg border text-sm shadow-sm transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.serviceDate && touched.serviceDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.serviceDate && touched.serviceDate && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" />
                                    {errors.serviceDate}
                                </p>
                            )}
                        </div>

                        {/* Time Slot */}
                        <div className="w-full">
                            <label
                                htmlFor="serviceTime"
                                className="text-sm font-medium text-gray-700 flex items-center mb-2"
                            >
                                Select Time Slot <span className="text-red-500 ml-1">*</span>
                            </label>

                            <select
                                id="serviceTime"
                                name="serviceTime"
                                value={formData.serviceTime}
                                onChange={handleSelectChange}
                                onBlur={handleBlur as any}
                                className={`w-full px-3 py-2 rounded-lg text-sm shadow-sm border transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.serviceTime && touched.serviceTime
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.serviceTime}
                            >
                                <option value="" disabled>
                                    Choose a time slot
                                </option>
                                {timeSlots.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>

                            {errors.serviceTime && touched.serviceTime && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" />
                                    {errors.serviceTime}
                                </p>
                            )}

                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Info size={12} className="mr-1" />
                                All times are in your local timezone
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            {/* Continue Button */}
            <Button
                type="button"
                onClick={handleContinueToPayment}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center text-base font-medium shadow-sm hover:shadow mt-4"
            >
                Continue to Payment <ArrowRight size={16} className="ml-2"/>
            </Button>

            <p className="text-center text-xs text-gray-500 mt-2">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
}