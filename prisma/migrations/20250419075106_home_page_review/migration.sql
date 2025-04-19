-- CreateTable
CREATE TABLE "HomepageReview" (
    "reviewId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageReview_reviewId_key" ON "HomepageReview"("reviewId");

-- AddForeignKey
ALTER TABLE "HomepageReview" ADD CONSTRAINT "HomepageReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
