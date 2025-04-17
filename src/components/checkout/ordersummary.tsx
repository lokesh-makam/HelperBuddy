import React, {useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { useState } from "react";
import {useUser} from "@clerk/nextjs";
import {getuser} from "@/src/actions/user";
import Loading from "@/src/app/loading";

interface CartItem {
    id: string;
    name: string;
    basePrice: number;
}

interface OrderSummaryProps {
    cart: CartItem[];
    totalAmount: number;
    wallet: number;
    setwallet: React.Dispatch<React.SetStateAction<number>>;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, totalAmount,wallet,setwallet}) => {
    const [useWallet, setUseWallet] = useState(false); // State to handle checkbox
    const {user}=useUser();
    const [Hide, setHide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [wall,setwall] = useState(0);
    const [tot,settot] = useState(totalAmount);
    useEffect(() => {
        if(user){
            getuser(user.emailAddresses[0]?.emailAddress).then((res:any)=>{
                setLoading(false);
                if(res.walletBalance>0){
                    setwall(res.walletBalance);
                    setUseWallet(true);
                }else{
                    setHide(true);
                    setUseWallet(false);
                }
            })
        }
    }, [user]);
    useEffect(() => {
        if(useWallet){
            if(user){
                getuser(user.emailAddresses[0]?.emailAddress).then((res:any)=>{
                    if(res.walletBalance>0){
                        if(res.walletBalance>totalAmount){
                            setwallet(totalAmount);
                            settot(0);
                        }else{
                            setwallet(res.walletBalance);
                            settot(totalAmount-res.walletBalance);
                        }
                    }else{
                        setHide(true);
                        setUseWallet(false);
                    }
                })
            }
        }else{
            setwallet(0);
            settot(totalAmount);
        }
    }, [useWallet,user]);
    if(loading) {
        return <Loading/>;
    }
    return (
        <Card className="bg-gray-50">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>₹{item.basePrice}</span>
                        </div>
                    ))}
                    <Separator />

                    {/* Checkbox for using wallet amount */}
                    {!Hide &&

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="use-wallet"
                                    checked={useWallet}
                                    onChange={() => setUseWallet(!useWallet)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="use-wallet" className="text-sm text-gray-700">
                                    Use Wallet Amount ({wall > 0 ? `₹${wall}` : "No balance available"})
                                </label>
                            </div>
                    }
                    <Separator/>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{tot}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
