"use client"
import React, { useState } from 'react';
import { Copy, CheckCircle2, Share2, Gift, Users, Coins } from 'lucide-react';
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

const ReferralPage = () => {
    const [copied, setCopied] = useState(false);
    const referralCode = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Refer Friends, Earn Rewards</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Share the love and get ₹50 for every friend who joins
                </p>
            </div>

            {/* Main Card */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                        <Gift className="h-16 w-16 text-purple-500 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Your Referral Code</h2>
                        <div className="w-full max-w-md bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                            <span className="font-mono text-lg font-semibold">{referralCode}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="flex items-center gap-2"
                            >
                                {copied ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                        <Button className="w-full max-w-md flex items-center justify-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Share with Friends
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* How it Works Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Share2 className="h-12 w-12 text-blue-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Share Your Code</h3>
                            <p className="text-gray-600">Share your unique referral code with friends</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Users className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Friends Join</h3>
                            <p className="text-gray-600">Your friends sign up using your referral code</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Coins className="h-12 w-12 text-yellow-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
                            <p className="text-gray-600">Get ₹50 for each friend who joins</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Terms Alert */}
            <Alert className="bg-gray-50 border-gray-200">
                <AlertDescription className="text-sm text-gray-600">
                    Terms and conditions apply. Referral rewards are credited after your friend's first successful order.
                    Maximum referral reward: ₹250 per account.
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default ReferralPage;