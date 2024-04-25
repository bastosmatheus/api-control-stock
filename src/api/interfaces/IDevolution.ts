import { Devolution } from "@prisma/client";

enum EDevolutionResponse {
  DevolutionNotFound,
  EntranceNotFound,
  NotAuthorized,
}

interface IDevolution {
  getAll(): Promise<Devolution[]>;
  getById(id: number): Promise<EDevolutionResponse.DevolutionNotFound | Devolution>;
  create(
    description: string,
    quantity_products: number,
    id_entrance: number,
    id_store_token: number
  ): Promise<EDevolutionResponse.EntranceNotFound | EDevolutionResponse.NotAuthorized | Devolution>;
  update(
    id: number,
    description: string,
    quantity_products: number,
    id_store_token: number
  ): Promise<
    EDevolutionResponse.DevolutionNotFound | EDevolutionResponse.NotAuthorized | Devolution
  >;
  delete(
    id: number,
    id_store_token: number
  ): Promise<
    EDevolutionResponse.DevolutionNotFound | EDevolutionResponse.NotAuthorized | Devolution
  >;
}

export { IDevolution, EDevolutionResponse };
