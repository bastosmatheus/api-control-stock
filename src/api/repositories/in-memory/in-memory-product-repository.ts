import { Product, Store } from "@prisma/client";
import { EProductResponse } from "../../interfaces/IProduct";

class InMemoryProductRepository {
  public readonly products: Product[] = [];
  public readonly stores: Store[] = [
    {
      id: 1,
      name_store: "mT loja",
      email: "matheus@gmail.com",
      password: "10203040",
    },
  ];

  public async getAll(): Promise<Product[]> {
    return this.products;
  }

  public async getById(id: number): Promise<EProductResponse.ProductNotFound | Product> {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return EProductResponse.ProductNotFound;
    }

    return product;
  }

  public async create(
    name_product: string,
    price_product: number,
    id_store: number,
    id_store_token: number
  ): Promise<
    | EProductResponse.ProductExists
    | EProductResponse.NotAuthorized
    | EProductResponse.StoreNotFound
    | Product
  > {
    if (id_store !== id_store_token) {
      return EProductResponse.NotAuthorized;
    }

    const productExists = this.products.find((product) => product.name_product === name_product);

    if (productExists) {
      return EProductResponse.ProductExists;
    }

    const storeExists = this.stores.find((store) => store.id === id_store);

    if (!storeExists) {
      return EProductResponse.StoreNotFound;
    }

    const product = {
      id: 1,
      name_product,
      price_product,
      quantity_product_stock: 100,
      id_store,
    };

    this.products.push(product);

    return product;
  }

  public async update(
    id: number,
    name_product: string,
    price_product: number,
    id_store_token: number
  ): Promise<
    | Product
    | EProductResponse.ProductExists
    | EProductResponse.NotAuthorized
    | EProductResponse.ProductNotFound
  > {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return EProductResponse.ProductNotFound;
    }

    if (product.id_store !== id_store_token) {
      return EProductResponse.NotAuthorized;
    }

    const productNameExists = this.products.find(
      (product) => product.name_product === name_product
    );

    if (productNameExists && productNameExists.id !== id) {
      return EProductResponse.ProductNotFound;
    }

    product.name_product = name_product;
    product.price_product = price_product;

    return product;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<EProductResponse.ProductNotFound | EProductResponse.NotAuthorized | Product> {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return EProductResponse.ProductNotFound;
    }

    if (product.id_store !== id_store_token) {
      return EProductResponse.NotAuthorized;
    }

    return product;
  }
}

export { InMemoryProductRepository };
