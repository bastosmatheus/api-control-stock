/*
  Warnings:

  - A unique constraint covering the columns `[name_store]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `stores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stores_name_store_key" ON "stores"("name_store");

-- CreateIndex
CREATE UNIQUE INDEX "stores_email_key" ON "stores"("email");
