/*
  Warnings:

  - A unique constraint covering the columns `[reason]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Shopping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Expense_reason_key` ON `Expense`(`reason`);
