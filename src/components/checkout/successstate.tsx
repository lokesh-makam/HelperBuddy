import React from 'react';
import {Button}  from '@/src/components/ui/button';
import { Check } from 'lucide-react';

interface SuccessStateProps {
    onContinueShopping: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ onContinueShopping }) => (
    <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold">Order Placed Successfully!</h2>
        <p className="text-gray-600">Thank you for your purchase. Your order will be delivered soon.</p>
        <Button
            onClick={onContinueShopping}
            className="mt-4"
        >
            Continue Shopping
        </Button>
    </div>
);