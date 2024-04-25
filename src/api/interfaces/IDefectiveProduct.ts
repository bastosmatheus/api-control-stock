import { DefectiveProduct } from "@prisma/client";

enum EDefectiveProductResponse {
  DefectiveProductNotFound,
  EntranceNotFound,
  NotAuthorized,
}

interface IDefectiveProduct {
  getAll(): Promise<DefectiveProduct[]>;
  getById(
    id: number
  ): Promise<EDefectiveProductResponse.DefectiveProductNotFound | DefectiveProduct>;
  create(
    description: string,
    quantity_products: number,
    id_entrance: number,
    id_store_token: number
  ): Promise<
    | EDefectiveProductResponse.EntranceNotFound
    | EDefectiveProductResponse.NotAuthorized
    | DefectiveProduct
  >;
  update(
    id: number,
    description: string,
    quantity_products: number,
    id_store_token: number
  ): Promise<
    | EDefectiveProductResponse.DefectiveProductNotFound
    | EDefectiveProductResponse.NotAuthorized
    | DefectiveProduct
  >;
  delete(
    id: number,
    id_store_token: number
  ): Promise<
    | EDefectiveProductResponse.DefectiveProductNotFound
    | EDefectiveProductResponse.NotAuthorized
    | DefectiveProduct
  >;
}

export { IDefectiveProduct, EDefectiveProductResponse };
