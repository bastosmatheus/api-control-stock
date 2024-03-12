import { Entrance } from "@prisma/client";

enum EEntranceResponse {
  EntranceNotFound,
  ProductNotFound,
}

interface IEntrance {
  getAll(): Promise<Entrance[]>;
  getById(id: number): Promise<EEntranceResponse.EntranceNotFound | Entrance>;
  create(
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number
  ): Promise<EEntranceResponse.ProductNotFound | Entrance>;
  update(
    id: number,
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number
  ): Promise<EEntranceResponse.EntranceNotFound | EEntranceResponse.ProductNotFound | Entrance>;
  delete(id: number): Promise<EEntranceResponse.EntranceNotFound | Entrance>;
}

export { IEntrance, EEntranceResponse };
