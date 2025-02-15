import React, { useState } from 'react';
import {PersonalDetails} from '@/src/components/checkout/personaldetails';
import {AddressDetails} from '@/src/components/checkout/addressdetails';
import {PaymentDetails} from '@/src/components/checkout/paymentdetails';
import {SuccessState} from '@/src/components/checkout/successstate';
import {Button} from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface CheckoutFormProps {
    step: number;
    setStep: (step: number) => void;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ step, setStep, loading, onSubmit }) => {
    // ✅ State to manage form values
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    // ✅ Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle "Continue Shopping" click (for SuccessState)
    const handleContinueShopping = () => {
        setStep(1);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
                {step === 3 ? (
                    <SuccessState onContinueShopping={handleContinueShopping} />
                ) : (
                    <form onSubmit={onSubmit} className="space-y-8">
                        {step === 1 ? (
                            <>
                                {/* ✅ Pass `onChange` and `values` to PersonalDetails */}
                                <PersonalDetails onChange={handleChange} values={formData} />
                                {/* ✅ Pass `onChange` and `values` to AddressDetails */}
                                <AddressDetails onChange={handleChange} values={formData} />
                                <Button type="button" onClick={() => setStep(2)} className="w-full">
                                    Continue to Payment
                                </Button>
                            </>
                        ) : step === 2 ? (
                            <>
                                {/* ✅ Pass `onChange` and `values` to PaymentDetails */}
                                <PaymentDetails onChange={handleChange} values={formData} />
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

