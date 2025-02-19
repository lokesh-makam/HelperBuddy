"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Wallet } from "lucide-react"
import {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
import Loading from "@/src/app/loading";
import {getwallet} from "@/src/actions/referal";

const WalletPage = () => {
    const {user} = useUser();
    const [balance, setBalance] = useState(100);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if(user){
            console.log(user);
            //@ts-ignore
            getwallet(user.id).then((data) => setBalance(data));
            setLoading(false)
        }
    }, [user]);
    if(loading) return <Loading/>
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-2xl text-gray-700 font-bold">Wallet Balance</CardTitle>
                    <Wallet className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gray-700 text-center py-8">
                        {balance} INR
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default WalletPage