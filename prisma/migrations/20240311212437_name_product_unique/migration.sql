/*
  Warnings:

  - A unique constraint covering the columns `[name_product]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_name_product_key" ON "products"("name_product");
