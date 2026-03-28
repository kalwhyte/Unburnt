/*
  Warnings:

  - You are about to drop the column `firstName` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Trigger` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Trigger_firstName_key";

-- DropIndex
DROP INDEX "Trigger_lastName_key";

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_name_key" ON "Trigger"("name");
