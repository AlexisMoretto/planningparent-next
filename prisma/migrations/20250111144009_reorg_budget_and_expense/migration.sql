/*
  Warnings:

  - The primary key for the `budget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expense` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `budget` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `budget` DROP PRIMARY KEY,
    DROP COLUMN `expense`,
    DROP COLUMN `id`,
    DROP COLUMN `reason`;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` VARCHAR(191) NOT NULL,
    `expense` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Budget_email_key` ON `Budget`(`email`);
