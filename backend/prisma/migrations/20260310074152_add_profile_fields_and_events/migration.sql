/*
  Warnings:

  - The values [FOUNDER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `clientId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `lawyerId` on the `Case` table. All the data in the column will be lost.
  - The `status` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `barLicenseNo` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `courtJurisdiction` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `studentIdCard` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfStudy` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CustodyLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evidence` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jaiId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Case` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `barEnrollmentNo` to the `LawyerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practicingCourt` to the `LawyerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PUBLIC', 'STUDENT', 'LAWYER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PUBLIC';
COMMIT;

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_lawyerId_fkey";

-- DropForeignKey
ALTER TABLE "CustodyLog" DROP CONSTRAINT "CustodyLog_actorId_fkey";

-- DropForeignKey
ALTER TABLE "CustodyLog" DROP CONSTRAINT "CustodyLog_evidenceId_fkey";

-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "LawyerProfile" DROP CONSTRAINT "LawyerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropIndex
DROP INDEX "LawyerProfile_barLicenseNo_key";

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "hash" TEXT,
ADD COLUMN     "newValue" TEXT,
ADD COLUMN     "targetId" TEXT,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "details" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "clientId",
DROP COLUMN "lawyerId",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "LawyerProfile" DROP COLUMN "barLicenseNo",
DROP COLUMN "courtJurisdiction",
DROP COLUMN "isVerified",
ADD COLUMN     "barEnrollmentNo" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "practicingCourt" TEXT NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "specialization" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "read";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "studentIdCard",
DROP COLUMN "yearOfStudy",
ADD COLUMN     "enrollmentNo" TEXT,
ADD COLUMN     "year" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
DROP COLUMN "passwordHash",
ADD COLUMN     "jaiId" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "fullName" DROP NOT NULL;

-- DropTable
DROP TABLE "CustodyLog";

-- DropTable
DROP TABLE "Evidence";

-- DropEnum
DROP TYPE "CaseStatus";

-- DropEnum
DROP TYPE "CustodyAction";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_jaiId_key" ON "User"("jaiId");

-- AddForeignKey
ALTER TABLE "LawyerProfile" ADD CONSTRAINT "LawyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
