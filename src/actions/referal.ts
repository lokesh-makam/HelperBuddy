"use server";

import { db } from "@/src/lib/db";

const REFERRAL_LIMIT = 5;
const REWARD_AMOUNT = 50;

// Fetch the referral code for a user
export async function getReferralCode(userId: string) {
    if (!userId) return null;
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { referralCode: true },
        });

        return user?.referralCode || null;
    } catch (error) {
        console.error("Failed to fetch referral code:", error);
        return null;
    }
}

export async function enterReferralCode(userId: string, referralCode: string) {
    if (!userId || !referralCode) {
        return { error: "User ID and Referral Code are required." };
    }

    try {
        // Find the referrer by their referral code
        const referrer = await db.user.findUnique({
            where: { referralCode },
        });

        if (!referrer) {
            return { error: "Invalid referral code." };
        }

        // Prevent self-referral
        if (referrer.id === userId) {
            return { error: "You cannot refer yourself." };
        }

        const existingReferral = await db.referral.findFirst({
            where: {
                OR: [
                    { referrerId: referrer.id, refereeId: userId }, // A → B
                    { referrerId: userId, refereeId: referrer.id }, // B → A (reverse)
                ],
            },
        });

        if (existingReferral) {
            return { error: "Referral already exists between these users." };
        }

        // Check referral limits for the referrer
        const referrerReferralCount = await db.referral.count({ where: { referrerId: referrer.id } });
        if (referrerReferralCount >= REFERRAL_LIMIT) {
            return { error: `Referrer has reached the limit of ${REFERRAL_LIMIT} referrals.` };
        }

        // Apply referral reward only to the referrer
        await db.$transaction([
            db.referral.create({
                data: {
                    referrerId: referrer.id,
                    refereeId: userId,
                    rewardAmount: REWARD_AMOUNT,
                },
            }),
            db.user.update({
                where: { id: referrer.id },
                data: { walletBalance: { increment: REWARD_AMOUNT } },
            }),
        ]);

        return { success: `Referral applied! ₹${REWARD_AMOUNT} added to referrer's wallet.` };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { error: "You have already used a referral code and cannot use another." };
        }
        console.error("Failed to process referral:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export const getwallet=async(userId:string)=>{
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { walletBalance: true },
        });
        return user?.walletBalance || null;
    } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        return null;
    }
}