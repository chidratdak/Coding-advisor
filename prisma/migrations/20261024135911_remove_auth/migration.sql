/*
  Warnings:

  - You are about to drop the column `userId` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavingsGoal" DROP CONSTRAINT "SavingsGoal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "SavingsGoal_userId_idx";

-- DropIndex
DROP INDEX "Transaction_userId_idx";

-- AlterTable
ALTER TABLE "SavingsGoal" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
