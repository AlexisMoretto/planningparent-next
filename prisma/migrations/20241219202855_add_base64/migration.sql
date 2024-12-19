/*
  Warnings:

  - Added the required column `base64` to the `familyImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `familyimage` ADD COLUMN `base64` VARCHAR(191) NOT NULL;
