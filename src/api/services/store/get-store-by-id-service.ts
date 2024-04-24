import { z } from "zod";
import { Store } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFoundError";
import { EStoreResponse } from "../../interfaces/IStore";
import { BadRequestError } from "../../errors/BadRequestError";
import { StoreRepository } from "../../repositories/StoreRepository";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { Either, failure, success } from "../../errors/either";

class GetStoreByIdService {
  constructor(private storeRepository: StoreRepository) {}

  public async execute(
    id: number
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, Store>> {
    const storeSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const storeValidation = storeSchema.safeParse({
      id,
    });

    if (!storeValidation.success) {
      const storeError = storeValidation.error.errors[0];

      return failure(new BadRequestError(storeError.message));
    }

    const store = await this.storeRepository.getById(id);

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Nenhuma loja foi encontrada com o ID: " + id));
    }

    return success(store);
  }
}

export { GetStoreByIdService };
