import { Product } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EProductResponse, IProduct } from "../interfaces/IProduct";

class ProductRepository implements IProduct {
  public async getAll(): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      include: {
        entrance: true,
        exit: true,
        defective_product: true,
        devolution: true,
      },
    });

    return products;
  }

  public async getById(id: number): Promise<Product | EProductResponse.ProductNotFound> {
    const product = await prismaClient.product.findUnique({
      where: {
        id,
      },
      include: {
        entrance: true,
        exit: true,
        defective_product: true,
        devolution: true,
      },
    });

    if (product === null) {
      return EProductResponse.ProductNotFound;
    }

    return product;
  }

  public async create(
    name_product: string,
    price_product: number
  ): Promise<Product | EProductResponse.ProductExists> {
    const productExists = await prismaClient.product.findUnique({
      where: {
        name_product,
      },
    });

    if (productExists) {
      return EProductResponse.ProductExists;
    }

    const product = await prismaClient.product.create({
      data: {
        name_product,
        price_product,
      },
    });

    return product;
  }

  public async update(
    id: number,
    name_product: string,
    price_product: number
  ): Promise<Product | EProductResponse.ProductExists | EProductResponse.ProductNotFound> {
    const product = await prismaClient.product.findUnique({
      where: {
        id,
      },
    });

    if (product === null) {
      return EProductResponse.ProductNotFound;
    }

    const productExists = await prismaClient.product.findUnique({
      where: {
        name_product,
      },
    });

    if (productExists && productExists.id !== id) {
      return EProductResponse.ProductExists;
    }

    const productUpdated = await prismaClient.product.update({
      data: {
        name_product,
        price_product,
      },
      where: {
        id,
      },
    });

    return productUpdated;
  }

  // public async updateStock(
  //   id: number,
  //   quantity_product_stock: number
  // ): Promise<Product | EProductResponse.ProductNotFound> {
  //   const user = await prismaClient.product.findUnique({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (user === null) {
  //     return EProductResponse.ProductNotFound;
  //   }

  //   const userUpdated = await prismaClient.product.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       quantity_product_stock,
  //     },
  //   });

  //   return userUpdated;
  // }

  public async delete(id: number): Promise<Product | EProductResponse.ProductNotFound> {
    const product = await prismaClient.product.findUnique({
      where: {
        id,
      },
    });

    if (product === null) {
      return EProductResponse.ProductNotFound;
    }

    const productDeleted = await prismaClient.product.delete({
      where: {
        id,
      },
    });

    return productDeleted;
  }
}

export { ProductRepository };
