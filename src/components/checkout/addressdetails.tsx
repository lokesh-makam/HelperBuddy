import React from 'react';
import { Input } from '@/src/components/ui/input';  // Correct import path
import { Label } from '@/src/components/ui/label';

interface AddressDetailsProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    values?: {  // Make values optional
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
}

export const AddressDetails: React.FC<AddressDetailsProps> = ({ onChange, values = { address: '', city: '', state: '', pincode: '' } }) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
                id="address"
                name="address"
                value={values.address}
                onChange={onChange}
                required
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                    id="city"
                    name="city"
                    value={values.city}
                    onChange={onChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                    id="state"
                    name="state"
                    value={values.state}
                    onChange={onChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                    id="pincode"
                    name="pincode"
                    value={values.pincode}
                    onChange={onChange}
                    required
                />
            </div>
        </div>
    </div>
);
