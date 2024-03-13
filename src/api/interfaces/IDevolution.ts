import { Devolution } from "@prisma/client";

enum EDevolutionResponse {
  DevolutionNotFound,
  EntranceNotFound,
}

interface IDevolution {
  getAll(): Promise<Devolution[]>;
  getById(id: number): Promise<EDevolutionResponse.DevolutionNotFound | Devolution>;
  create(
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<EDevolutionResponse.EntranceNotFound | Devolution>;
  update(
    id: number,
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<
    EDevolutionResponse.DevolutionNotFound | EDevolutionResponse.EntranceNotFound | Devolution
  >;
  delete(id: number): Promise<EDevolutionResponse.DevolutionNotFound | Devolution>;
}

export { IDevolution, EDevolutionResponse };
