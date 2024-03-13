import { prismaClient } from "../database/prismaClient";
import { DefectiveProduct } from "@prisma/client";
import { EDefectiveProductResponse, IDefectiveProduct } from "../interfaces/IDefectiveProduct";

class DefectiveProductRepository implements IDefectiveProduct {
  public async getAll(): Promise<DefectiveProduct[]> {
    const defectiveProducts = await prismaClient.defectiveProduct.findMany();

    return defectiveProducts;
  }

  public async getById(
    id: number
  ): Promise<EDefectiveProductResponse.DefectiveProductNotFound | DefectiveProduct> {
    const defectiveProduct = await prismaClient.defectiveProduct.findUnique({
      where: {
        id,
      },
    });

    if (defectiveProduct === null) {
      return EDefectiveProductResponse.DefectiveProductNotFound;
    }

    return defectiveProduct;
  }

  public async create(
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<EDefectiveProductResponse.EntranceNotFound | DefectiveProduct> {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: id_entrance,
      },
    });

    if (entrance === null) {
      return EDefectiveProductResponse.EntranceNotFound;
    }

    const defectiveProduct = await prismaClient.defectiveProduct.create({
      data: {
        description,
        quantity_products,
        id_entrance,
      },
    });

    return defectiveProduct;
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<
    | EDefectiveProductResponse.DefectiveProductNotFound
    | EDefectiveProductResponse.EntranceNotFound
    | DefectiveProduct
  > {
    const entrance = await prismaClient.entrance.findUnique({
      where: {
        id: id_entrance,
      },
    });

    if (entrance === null) {
      return EDefectiveProductResponse.EntranceNotFound;
    }

    const defectiveProduct = await prismaClient.defectiveProduct.findUnique({
      where: {
        id,
      },
    });

    if (defectiveProduct === null) {
      return EDefectiveProductResponse.DefectiveProductNotFound;
    }

    const defectiveProductUpdated = await prismaClient.defectiveProduct.update({
      data: {
        description,
        quantity_products,
        id_entrance,
      },
      where: {
        id,
      },
    });

    return defectiveProductUpdated;
  }

  public async delete(
    id: number
  ): Promise<EDefectiveProductResponse.DefectiveProductNotFound | DefectiveProduct> {
    const defectiveProduct = await prismaClient.defectiveProduct.findUnique({
      where: {
        id,
      },
    });

    if (defectiveProduct === null) {
      return EDefectiveProductResponse.DefectiveProductNotFound;
    }

    return defectiveProduct;
  }
}

export { DefectiveProductRepository };
