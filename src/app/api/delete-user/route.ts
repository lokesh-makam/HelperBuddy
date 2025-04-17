import type { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const client = await clerkClient(); // fix here
    await client.users.deleteUser(userId);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("User deletion failed:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}
