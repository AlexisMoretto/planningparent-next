/*
  Warnings:

  - You are about to drop the column `date` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `event` table. All the data in the column will be lost.
  - Added the required column `eventDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `date`,
    DROP COLUMN `name`,
    DROP COLUMN `time`,
    ADD COLUMN `eventDate` DATETIME(3) NOT NULL,
    ADD COLUMN `eventName` VARCHAR(191) NOT NULL,
    ADD COLUMN `eventTime` VARCHAR(191) NOT NULL;
