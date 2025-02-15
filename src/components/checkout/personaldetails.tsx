import React from 'react';
import { Input } from '@/src/components/ui/input';  // Ensure correct import path
import { Label } from '@/src/components/ui/label';

interface PersonalDetailsProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    values: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ onChange, values }) => {
    if (!values) return <div className="text-red-500">Error: Missing values prop</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={values.firstName}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>
        </div>
    );
};
