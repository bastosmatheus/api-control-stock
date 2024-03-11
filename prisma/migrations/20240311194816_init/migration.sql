-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL,
    "name_product" TEXT NOT NULL,
    "price_product" INTEGER NOT NULL,
    "quantity_product_stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrances" (
    "id" INTEGER NOT NULL,
    "supplier" TEXT NOT NULL,
    "quantity_products" INTEGER NOT NULL,
    "price_total" INTEGER NOT NULL,
    "entrance_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_product" INTEGER NOT NULL,

    CONSTRAINT "entrances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exits" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity_products" INTEGER NOT NULL,
    "exit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_product" INTEGER NOT NULL,

    CONSTRAINT "exits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolutions" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "devolution_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_product" INTEGER NOT NULL,

    CONSTRAINT "devolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defective_products" (
    "id" INTEGER NOT NULL,
    "quantity_products" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,

    CONSTRAINT "defective_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "entrances" ADD CONSTRAINT "entrances_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolutions" ADD CONSTRAINT "devolutions_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_products" ADD CONSTRAINT "defective_products_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
