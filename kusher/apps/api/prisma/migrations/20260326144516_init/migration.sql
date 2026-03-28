/*
  Warnings:

  - You are about to drop the column `name` on the `Trigger` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firstName]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lastName]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Trigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Trigger_name_key";

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_firstName_key" ON "Trigger"("firstName");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_lastName_key" ON "Trigger"("lastName");
