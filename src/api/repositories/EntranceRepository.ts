import { Entrance } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EEntranceResponse, IEntrance } from "../interfaces/IEntrance";

class EntranceRepository implements IEntrance {
  public async getAll(): Promise<Entrance[]> {
    const entrances = await prismaClient.entrance.findMany({
      include: {
        DefectiveProduct: true,
        Devolution: true,
      },
    });

    return entrances;
  }

  public async getById(id: number): Promise<EEntranceResponse.EntranceNotFound | Entrance> {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id,
      },
      include: {
        DefectiveProduct: true,
        Devolution: true,
      },
    });

    if (entrance === null) {
      return EEntranceResponse.EntranceNotFound;
    }

    return entrance;
  }

  public async create(
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number
  ): Promise<EEntranceResponse.ProductNotFound | Entrance> {
    const product = await prismaClient.product.findUnique({
      where: {
        id: id_product,
      },
    });

    if (product === null) {
      return EEntranceResponse.ProductNotFound;
    }

    const entrance = await prismaClient.entrance.create({
      data: {
        supplier,
        quantity_products,
        price_total,
        id_product,
      },
    });

    return entrance;
  }

  public async update(
    id: number,
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number
  ): Promise<EEntranceResponse.EntranceNotFound | EEntranceResponse.ProductNotFound | Entrance> {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id,
      },
    });

    if (entrance === null) {
      return EEntranceResponse.EntranceNotFound;
    }

    const product = await prismaClient.product.findUnique({
      where: {
        id: id_product,
      },
    });

    if (product === null) {
      return EEntranceResponse.ProductNotFound;
    }

    const entranceUpdated = await prismaClient.entrance.update({
      data: {
        supplier,
        quantity_products,
        price_total,
        id_product,
      },
      where: {
        id,
      },
    });

    return entranceUpdated;
  }

  public async delete(id: number): Promise<EEntranceResponse.EntranceNotFound | Entrance> {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id,
      },
    });

    if (entrance === null) {
      return EEntranceResponse.EntranceNotFound;
    }

    const entranceDeleted = await prismaClient.entrance.delete({
      where: {
        id,
      },
    });

    return entranceDeleted;
  }
}

export { EntranceRepository };
