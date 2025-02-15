import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';

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
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi">UPI</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
            </div>
        </RadioGroup>

        {values.paymentMethod === 'card' && (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={values.cardNumber}
                        onChange={onChange}
                        placeholder="1234 5678 9012 3456"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={values.cardExpiry}
                            onChange={onChange}
                            placeholder="MM/YY"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                            id="cardCvv"
                            name="cardCvv"
                            type="password"
                            maxLength={3}
                            value={values.cardCvv}
                            onChange={onChange}
                            required
                        />
                    </div>
                </div>
            </div>
        )}
    </div>
);