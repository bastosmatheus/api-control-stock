import { Entrance } from "@prisma/client";

enum EEntranceResponse {
  EntranceNotFound,
  ProductNotFound,
  NotAuthorized,
}

interface IEntrance {
  getAll(): Promise<Entrance[]>;
  getById(id: number): Promise<EEntranceResponse.EntranceNotFound | Entrance>;
  create(
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<EEntranceResponse.ProductNotFound | EEntranceResponse.NotAuthorized | Entrance>;
  update(
    id: number,
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<
    | EEntranceResponse.EntranceNotFound
    | EEntranceResponse.NotAuthorized
    | EEntranceResponse.ProductNotFound
    | Entrance
  >;
  delete(
    id: number,
    id_store_token: number
  ): Promise<EEntranceResponse.EntranceNotFound | EEntranceResponse.NotAuthorized | Entrance>;
}

export { IEntrance, EEntranceResponse };
