/*
  Warnings:

  - You are about to drop the column `id_product` on the `defective_products` table. All the data in the column will be lost.
  - You are about to drop the column `id_product` on the `devolutions` table. All the data in the column will be lost.
  - Added the required column `description` to the `defective_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_products` to the `devolutions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "defective_products" DROP CONSTRAINT "defective_products_id_product_fkey";

-- DropForeignKey
ALTER TABLE "devolutions" DROP CONSTRAINT "devolutions_id_product_fkey";

-- AlterTable
ALTER TABLE "defective_products" DROP COLUMN "id_product",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "devolutions" DROP COLUMN "id_product",
ADD COLUMN     "quantity_products" INTEGER NOT NULL;
