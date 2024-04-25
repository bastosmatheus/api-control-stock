import { Exit } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EExitResponse, IExit } from "../interfaces/IExit";

class ExitRepository implements IExit {
  public async getAll(): Promise<Exit[]> {
    const exits = await prismaClient.exit.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return exits;
  }

  public async getById(id: number): Promise<EExitResponse.ExitNotFound | Exit> {
    const exit = await prismaClient.exit.findUnique({
      where: {
        id,
      },
    });

    if (exit === null) {
      return EExitResponse.ExitNotFound;
    }

    return exit;
  }

  public async create(
    description: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<
    EExitResponse.ProductNotFound | EExitResponse.NoStock | EExitResponse.NotAuthorized | Exit
  > {
    const product = await prismaClient.product.findUnique({
      where: {
        id: id_product,
      },
    });

    if (product === null) {
      return EExitResponse.ProductNotFound;
    }

    if (product.id_store !== id_store_token) {
      return EExitResponse.NotAuthorized;
    }

    if (product.quantity_product_stock - quantity_products < 0) {
      return EExitResponse.NoStock;
    }

    const exit = await prismaClient.exit.create({
      data: {
        description,
        quantity_products,
        price_total,
        id_product,
      },
    });

    return exit;
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    price_total: number,
    id_store_token: number
  ): Promise<
    EExitResponse.ExitNotFound | EExitResponse.NoStock | EExitResponse.NotAuthorized | Exit
  > {
    const exit = await prismaClient.exit.findUnique({
      where: {
        id,
      },
    });

    if (exit === null) {
      return EExitResponse.ExitNotFound;
    }

    const product = await prismaClient.product.findUnique({
      where: {
        id: exit.id_product,
      },
    });

    if (product?.id_store !== id_store_token) {
      return EExitResponse.NotAuthorized;
    }

    if (product.quantity_product_stock - quantity_products < 0) {
      return EExitResponse.NoStock;
    }

    const exitUpdated = await prismaClient.exit.update({
      data: {
        description,
        quantity_products,
        price_total,
      },
      where: {
        id,
      },
    });

    return exitUpdated;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<EExitResponse.ExitNotFound | EExitResponse.NotAuthorized | Exit> {
    const exit = await prismaClient.exit.findUnique({
      where: {
        id,
      },
    });

    if (exit === null) {
      return EExitResponse.ExitNotFound;
    }

    const product = await prismaClient.product.findUnique({
      where: {
        id: exit.id_product,
      },
    });

    if (product?.id_store !== id_store_token) {
      return EExitResponse.NotAuthorized;
    }

    const exitDeleted = await prismaClient.exit.delete({
      where: {
        id,
      },
    });

    return exitDeleted;
  }
}

export { ExitRepository };
