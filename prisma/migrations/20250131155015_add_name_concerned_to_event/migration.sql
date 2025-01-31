/*
  Warnings:

  - Added the required column `nameConcerned` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `nameConcerned` VARCHAR(191) NOT NULL;
