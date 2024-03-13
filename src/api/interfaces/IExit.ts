import { Exit } from "@prisma/client";

enum EExitResponse {
  ExitNotFound,
  ProductNotFound,
  NoStock,
}

interface IExit {
  getAll(): Promise<Exit[]>;
  getById(id: number): Promise<EExitResponse.ExitNotFound | Exit>;
  create(
    description: string,
    quantity_products: number,
    id_product: number
  ): Promise<EExitResponse.ProductNotFound | EExitResponse.NoStock | Exit>;
  update(
    id: number,
    description: string,
    quantity_products: number,
    id_product: number
  ): Promise<
    EExitResponse.ExitNotFound | EExitResponse.ProductNotFound | EExitResponse.NoStock | Exit
  >;
  delete(id: number): Promise<EExitResponse.ExitNotFound | Exit>;
}

export { IExit, EExitResponse };
