/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `paymentAt` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `preferredDate` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTime` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `ServiceRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `ServicePartner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressType` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorBio` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excerpt` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readTime` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `addressType` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountToPay` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartTotal` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNo` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderTotal` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDate` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceTime` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCost` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useWallet` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAmountUsed` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletBalance` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentMethod` on table `ServiceRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'OFFICE', 'OTHER');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "addressType" "AddressType" NOT NULL,
ALTER COLUMN "default" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "author",
DROP COLUMN "description",
ADD COLUMN     "authorBio" TEXT NOT NULL,
ADD COLUMN     "authorName" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "readTime" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'false';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "includes" TEXT,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServicePartner" ALTER COLUMN "serviceAreas" SET NOT NULL,
ALTER COLUMN "serviceAreas" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "address",
DROP COLUMN "amount",
DROP COLUMN "paymentAt",
DROP COLUMN "preferredDate",
DROP COLUMN "preferredTime",
DROP COLUMN "rating",
DROP COLUMN "review",
DROP COLUMN "reviewedAt",
ADD COLUMN     "addressType" TEXT NOT NULL,
ADD COLUMN     "amountToPay" INTEGER NOT NULL,
ADD COLUMN     "cartTotal" INTEGER NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "houseNo" TEXT NOT NULL,
ADD COLUMN     "orderTotal" INTEGER NOT NULL,
ADD COLUMN     "serviceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "serviceTime" TEXT NOT NULL,
ADD COLUMN     "shippingCost" INTEGER NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "tax" INTEGER NOT NULL,
ADD COLUMN     "useWallet" BOOLEAN NOT NULL,
ADD COLUMN     "walletAmountUsed" INTEGER NOT NULL,
ADD COLUMN     "walletBalance" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "paymentMethod" SET NOT NULL;

-- CreateTable
CREATE TABLE "ServicePartnerService" (
    "id" TEXT NOT NULL,
    "servicePartnerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicePartnerService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServicePartner_email_key" ON "ServicePartner"("email");

-- AddForeignKey
ALTER TABLE "ServicePartnerService" ADD CONSTRAINT "ServicePartnerService_servicePartnerId_fkey" FOREIGN KEY ("servicePartnerId") REFERENCES "ServicePartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePartnerService" ADD CONSTRAINT "ServicePartnerService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
