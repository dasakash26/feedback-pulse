-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'FEATURE', 'OTHER');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "email" TEXT,
ADD COLUMN     "feedbackType" "FeedbackType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sentiment" TEXT;
