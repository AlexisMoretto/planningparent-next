/*
  Warnings:

  - You are about to drop the column `userEmail` on the `familyimage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `familyImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `familyImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `familyImage_userEmail_key` ON `familyimage`;

-- AlterTable
ALTER TABLE `familyimage` DROP COLUMN `userEmail`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `familyImage_email_key` ON `familyImage`(`email`);
