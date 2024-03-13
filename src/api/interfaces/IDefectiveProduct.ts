import { DefectiveProduct } from "@prisma/client";

enum EDefectiveProductResponse {
  DefectiveProductNotFound,
  EntranceNotFound,
}

interface IDefectiveProduct {
  getAll(): Promise<DefectiveProduct[]>;
  getById(
    id: number
  ): Promise<EDefectiveProductResponse.DefectiveProductNotFound | DefectiveProduct>;
  create(
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<EDefectiveProductResponse.EntranceNotFound | DefectiveProduct>;
  update(
    id: number,
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<
    | EDefectiveProductResponse.DefectiveProductNotFound
    | EDefectiveProductResponse.EntranceNotFound
    | DefectiveProduct
  >;
  delete(
    id: number
  ): Promise<EDefectiveProductResponse.DefectiveProductNotFound | DefectiveProduct>;
}

export { IDefectiveProduct, EDefectiveProductResponse };
