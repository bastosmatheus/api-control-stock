import { Product } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EProductResponse, IProduct } from "../interfaces/IProduct";

class ProductRepository implements IProduct {
  public async getAll(): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        entrance: true,
        exit: true,
      },
    });

    const updatingQuantityProductsStock = await products.filter(async (product) => {
      const quantity_products_entrances = product.entrance.reduce(
        (accumulator, entrance) => entrance.quantity_products + accumulator,
        0
      );

      const quantity_products_exits = product.exit.reduce(
        (accumulator, exit) => exit.quantity_products + accumulator,
        0
      );

      const quantity_product_stock =
        quantity_products_entrances !== 0
          ? quantity_products_entrances - quantity_products_exits
          : 0;

      product.quantity_product_stock = quantity_product_stock;

      await prismaClient.product.update({
        data: {
          quantity_product_stock: product.quantity_product_stock,
        },
        where: {
          id: product.id,
        },
      });
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
      },
    });

    if (product === null) {
      return EProductResponse.ProductNotFound;
    }

    const quantity_products_entrances = product.entrance.reduce(
      (accumulator, entrance) => entrance.quantity_products + accumulator,
      0
    );

    const quantity_products_exits = product.exit.reduce(
      (accumulator, exit) => exit.quantity_products + accumulator,
      0
    );

    const quantity_product_stock =
      quantity_products_entrances !== 0 ? quantity_products_entrances - quantity_products_exits : 0;

    const stockUpdated = await prismaClient.product.update({
      data: {
        quantity_product_stock,
      },
      where: {
        id: id,
      },
      include: {
        entrance: true,
        exit: true,
      },
    });

    return stockUpdated;
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
