import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';

interface CartItem {
    id: string;
    name: string;
    basePrice: number;
}

interface OrderSummaryProps {
    cart: CartItem[];
    totalAmount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, totalAmount }) => (
    <Card className="bg-gray-50">
        <CardHeader>
            <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.name}
            </span>
                        <span>₹{item.basePrice}</span>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);
;