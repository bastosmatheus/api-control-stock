import { Product } from "@prisma/client";

enum EProductResponse {
  ProductNotFound,
  ProductExists,
  StoreNotFound,
  NotAuthorized,
}

interface IProduct {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | EProductResponse.ProductNotFound>;
  create(
    name_product: string,
    price_product: number,
    id_store: number,
    id_store_token: number
  ): Promise<
    | Product
    | EProductResponse.ProductExists
    | EProductResponse.StoreNotFound
    | EProductResponse.NotAuthorized
  >;
  update(
    id: number,
    name_product: string,
    price_product: number,
    id_store_token: number
  ): Promise<
    | Product
    | EProductResponse.ProductExists
    | EProductResponse.ProductNotFound
    | EProductResponse.NotAuthorized
  >;
  delete(
    id: number,
    id_store_token: number
  ): Promise<Product | EProductResponse.ProductNotFound | EProductResponse.NotAuthorized>;
}

export { IProduct, EProductResponse };
