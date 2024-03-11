-- AlterTable
CREATE SEQUENCE defective_products_id_seq;
ALTER TABLE "defective_products" ALTER COLUMN "id" SET DEFAULT nextval('defective_products_id_seq');
ALTER SEQUENCE defective_products_id_seq OWNED BY "defective_products"."id";

-- AlterTable
CREATE SEQUENCE devolutions_id_seq;
ALTER TABLE "devolutions" ALTER COLUMN "id" SET DEFAULT nextval('devolutions_id_seq');
ALTER SEQUENCE devolutions_id_seq OWNED BY "devolutions"."id";

-- AlterTable
CREATE SEQUENCE entrances_id_seq;
ALTER TABLE "entrances" ALTER COLUMN "id" SET DEFAULT nextval('entrances_id_seq');
ALTER SEQUENCE entrances_id_seq OWNED BY "entrances"."id";

-- AlterTable
CREATE SEQUENCE exits_id_seq;
ALTER TABLE "exits" ALTER COLUMN "id" SET DEFAULT nextval('exits_id_seq');
ALTER SEQUENCE exits_id_seq OWNED BY "exits"."id";

-- AlterTable
CREATE SEQUENCE products_id_seq;
ALTER TABLE "products" ALTER COLUMN "id" SET DEFAULT nextval('products_id_seq');
ALTER SEQUENCE products_id_seq OWNED BY "products"."id";
