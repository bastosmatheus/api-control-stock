/*
  Warnings:

  - Added the required column `price_total` to the `exits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "entrances" ALTER COLUMN "price_total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "price_total" DOUBLE PRECISION NOT NULL;
