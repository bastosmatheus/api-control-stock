import { Devolution } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EDevolutionResponse, IDevolution } from "../interfaces/IDevolution";

class DevolutionRepository implements IDevolution {
  public async getAll(): Promise<Devolution[]> {
    const devolutions = await prismaClient.devolution.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return devolutions;
  }

  public async getById(id: number): Promise<EDevolutionResponse.DevolutionNotFound | Devolution> {
    const devolution = await prismaClient.devolution.findUnique({
      where: {
        id,
      },
    });

    if (devolution === null) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    return devolution;
  }

  public async create(
    description: string,
    quantity_products: number,
    id_entrance: number,
    id_store_token: number
  ): Promise<
    EDevolutionResponse.EntranceNotFound | EDevolutionResponse.NotAuthorized | Devolution
  > {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: id_entrance,
      },
    });

    if (entrance === null) {
      return EDevolutionResponse.EntranceNotFound;
    }

    const product = await prismaClient.product.findUnique({
      where: {
        id: entrance.id_product,
      },
    });

    if (product?.id_store !== id_store_token) {
      return EDevolutionResponse.NotAuthorized;
    }

    const devolution = await prismaClient.devolution.create({
      data: {
        description,
        quantity_products,
        id_entrance,
      },
    });

    return devolution;
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_store_token: number
  ): Promise<
    EDevolutionResponse.DevolutionNotFound | EDevolutionResponse.NotAuthorized | Devolution
  > {
    const devolution = await prismaClient.devolution.findUnique({
      where: {
        id,
      },
    });

    if (devolution === null) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: devolution.id_entrance,
      },
    });

    const product = await prismaClient.product.findUnique({
      where: {
        id: entrance?.id_product,
      },
    });

    if (product?.id_store !== id_store_token) {
      return EDevolutionResponse.NotAuthorized;
    }

    const devolutionUpdated = await prismaClient.devolution.update({
      data: {
        description,
        quantity_products,
      },
      where: {
        id,
      },
    });

    return devolutionUpdated;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<
    EDevolutionResponse.DevolutionNotFound | EDevolutionResponse.NotAuthorized | Devolution
  > {
    const devolution = await prismaClient.devolution.findUnique({
      where: {
        id,
      },
    });

    if (devolution === null) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: devolution.id_entrance,
      },
    });

    const product = await prismaClient.product.findUnique({
      where: {
        id: entrance?.id_product,
      },
    });

    if (product?.id_store !== id_store_token) {
      return EDevolutionResponse.NotAuthorized;
    }

    const devolutionDeleted = await prismaClient.devolution.delete({
      where: {
        id,
      },
    });

    return devolutionDeleted;
  }
}

export { DevolutionRepository };
