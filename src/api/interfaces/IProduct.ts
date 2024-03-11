import { Product } from "@prisma/client";

enum EProductResponse {
  ProductNotFound,
  ProductExists,
}

interface IProduct {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | EProductResponse.ProductNotFound>;
  create(
    name_product: string,
    price_product: number
  ): Promise<Product | EProductResponse.ProductExists>;
  update(
    id: number,
    name_product: string,
    price_product: number
  ): Promise<Product | EProductResponse.ProductExists | EProductResponse.ProductNotFound>;
  delete(id: number): Promise<Product | EProductResponse.ProductNotFound>;
}

export { IProduct, EProductResponse };
