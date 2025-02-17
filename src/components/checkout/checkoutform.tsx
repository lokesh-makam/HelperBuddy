import React, {useEffect, useState} from 'react';
import {PersonalDetails} from '@/src/components/checkout/personaldetails';
import {AddressDetails} from '@/src/components/checkout/addressdetails';
import {PaymentDetails} from '@/src/components/checkout/paymentdetails';
import {SuccessState} from '@/src/components/checkout/successstate';
import {Button} from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {useUser} from "@clerk/nextjs";
import {useQuery} from "@tanstack/react-query";
import {getAddresses, getDefaultAddress} from "@/src/actions/addresses";
import Loading from "@/src/app/loading";
import {RadioGroup, RadioGroupItem} from "@/src/components/ui/radio-group";
import {Label} from "@/src/components/ui/label";
import {toast} from "react-toastify";

interface CheckoutFormProps {
    step: number;
    setStep: (step: number) => void;
    loading: boolean;
    onSubmit: (e: React.FormEvent, formData:any) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ step, setStep, loading, onSubmit }) => {
    // ✅ Get user info (Hooks should always be at the top)
    const { user, isLoaded } = useUser();

    // ✅ Initialize state before any return
    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        paymentMethod: 'card', // Added for radio selection
    });
    // ✅ Fetch default address
    const { data, isLoading, isError } = useQuery({
        queryKey: ['Addresses', user?.id],
        queryFn: () => getDefaultAddress(user?.id), // Ensure it's a function
        enabled: !!user?.id, // Prevents query execution if user is undefined
    });

    // ✅ Populate form data when address/user is available
    useEffect(() => {
        if (data && user) {
            setFormData(
                {
                ...formData,
                userId: user.id,
                firstName: user.firstName||'',
                lastName: user.lastName||'',
                email: user.primaryEmailAddress?.emailAddress ||'',
                address: `${data.houseNo} ${data.street}` ,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
            }
            );
        }
    }, [data, user]);

    // ✅ Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle payment method change
    const handlePaymentChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            paymentMethod: value,
        }));
    };

    // ✅ Handle "Continue Shopping" click (for SuccessState)
    const handleContinueShopping = () => {
        setStep(1);
        setFormData({
            userId: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            paymentMethod: 'card',
        });
    };

    // ✅ Avoid early return, use conditional rendering instead
    return (
        <Card>
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
                {!isLoaded ? (
                    <Loading />
                ) : step === 3 ? (
                    <SuccessState onContinueShopping={handleContinueShopping} />
                ) : (
                    <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-8">
                        {step === 1 ? (
                            <>
                                <PersonalDetails onChange={handleChange} values={formData} />
                                <AddressDetails onChange={handleChange} values={formData} />
                                <Button type="button" onClick={() => {
                                    if(!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.postalCode) {
                                        toast.error("All fields are required!");
                                    }else{
                                    setStep(2)
                                    }
                                }} className="w-full">
                                    Continue to Payment
                                </Button>
                            </>
                        ) : step === 2 ? (
                            <>
                                {/* ✅ Payment Method Selection */}
                                <div className="space-y-6">
                                    <RadioGroup defaultValue={formData.paymentMethod} onValueChange={handlePaymentChange}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card">Credit/Debit Card</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <Label htmlFor="cod">Cash on Delivery</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex gap-4">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </form>
                )}
            </CardContent>
        </Card>
    );
};
