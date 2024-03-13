/*
  Warnings:

  - Added the required column `id_entrance` to the `defective_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_entrance` to the `devolutions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "defective_products" ADD COLUMN     "id_entrance" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "devolutions" ADD COLUMN     "id_entrance" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "devolutions" ADD CONSTRAINT "devolutions_id_entrance_fkey" FOREIGN KEY ("id_entrance") REFERENCES "entrances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_products" ADD CONSTRAINT "defective_products_id_entrance_fkey" FOREIGN KEY ("id_entrance") REFERENCES "entrances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
