/*
  Warnings:

  - Added the required column `mimeType` to the `familyImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `familyimage` ADD COLUMN `mimeType` VARCHAR(191) NOT NULL;
