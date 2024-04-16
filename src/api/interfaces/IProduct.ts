import { Product } from "@prisma/client";

enum EProductResponse {
  ProductNotFound,
  ProductExists,
  StoreNotFound,
}

interface IProduct {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | EProductResponse.ProductNotFound>;
  create(
    name_product: string,
    price_product: number,
    id_store: number
  ): Promise<Product | EProductResponse.ProductExists | EProductResponse.StoreNotFound>;
  update(
    id: number,
    name_product: string,
    price_product: number
  ): Promise<Product | EProductResponse.ProductExists | EProductResponse.ProductNotFound>;
  delete(id: number): Promise<Product | EProductResponse.ProductNotFound>;
}

export { IProduct, EProductResponse };
