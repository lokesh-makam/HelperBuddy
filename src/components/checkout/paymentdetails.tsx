import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import { Label } from '@/src/components/ui/label';

export const PaymentDetails: React.FC<any> = ({ onChange, values }) => (
    <div className="space-y-6">
        <RadioGroup
            defaultValue="card"
            onValueChange={(value) => onChange({ target: { name: 'paymentMethod', value } } as React.ChangeEvent<HTMLInputElement>)}
        >
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
);