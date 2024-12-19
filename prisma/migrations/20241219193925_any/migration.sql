/*
  Warnings:

  - You are about to drop the column `url` on the `familyimage` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `familyImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `familyImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `familyimage` DROP COLUMN `url`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
