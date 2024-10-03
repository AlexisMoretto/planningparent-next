/*
  Warnings:

  - You are about to drop the column `email` on the `familyimage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `familyImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `familyImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `familyImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `familyImage_email_key` ON `familyimage`;

-- AlterTable
ALTER TABLE `familyimage` DROP COLUMN `email`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `familyImage_userEmail_key` ON `familyImage`(`userEmail`);
