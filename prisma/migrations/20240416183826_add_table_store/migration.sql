/*
  Warnings:

  - Added the required column `id_store` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "id_store" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "name_store" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_id_store_fkey" FOREIGN KEY ("id_store") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
