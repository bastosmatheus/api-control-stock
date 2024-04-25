import { Exit } from "@prisma/client";

enum EExitResponse {
  ExitNotFound,
  ProductNotFound,
  NoStock,
  NotAuthorized,
}

interface IExit {
  getAll(): Promise<Exit[]>;
  getById(id: number): Promise<EExitResponse.ExitNotFound | Exit>;
  create(
    description: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<
    EExitResponse.ProductNotFound | EExitResponse.NoStock | EExitResponse.NotAuthorized | Exit
  >;
  update(
    id: number,
    description: string,
    quantity_products: number,
    price_total: number,
    id_store_token: number
  ): Promise<
    EExitResponse.ExitNotFound | EExitResponse.NoStock | EExitResponse.NotAuthorized | Exit
  >;
  delete(
    id: number,
    id_store_token: number
  ): Promise<EExitResponse.ExitNotFound | EExitResponse.NotAuthorized | Exit>;
}

export { IExit, EExitResponse };
