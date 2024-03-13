import { Devolution } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EDevolutionResponse, IDevolution } from "../interfaces/IDevolution";

class DevolutionRepository implements IDevolution {
  public async getAll(): Promise<Devolution[]> {
    const devolutions = await prismaClient.devolution.findMany();

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
    id_entrance: number
  ): Promise<EDevolutionResponse.EntranceNotFound | Devolution> {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: id_entrance,
      },
    });

    if (entrance === null) {
      return EDevolutionResponse.EntranceNotFound;
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
    id_entrance: number
  ): Promise<
    EDevolutionResponse.DevolutionNotFound | EDevolutionResponse.EntranceNotFound | Devolution
  > {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: id_entrance,
      },
    });

    if (entrance === null) {
      return EDevolutionResponse.EntranceNotFound;
    }

    const devolution = await prismaClient.devolution.findUnique({
      where: {
        id,
      },
    });

    if (devolution === null) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    const devolutionUpdated = await prismaClient.devolution.update({
      data: {
        description,
        quantity_products,
        id_entrance,
      },
      where: {
        id,
      },
    });

    return devolutionUpdated;
  }

  public async delete(id: number): Promise<EDevolutionResponse.DevolutionNotFound | Devolution> {
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
}

export { DevolutionRepository };
