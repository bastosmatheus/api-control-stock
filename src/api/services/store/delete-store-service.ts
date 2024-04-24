import { z } from "zod";
import { Store } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { EStoreResponse } from "../../interfaces/IStore";
import { BadRequestError } from "../../errors/BadRequestError";
import { StoreRepository } from "../../repositories/StoreRepository";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { Either, failure, success } from "../../errors/either";

class DeleteStoreService {
  constructor(private storeRepository: StoreRepository) {}

  public async execute(
    id: number,
    infosToken: InfosToken
  ): Promise<Either<NotFoundError | UnauthorizedError | BadRequestError, Store>> {
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

    const store = await this.storeRepository.delete(id, infosToken.id);

    if (store === EStoreResponse.NotAuthorized) {
      return failure(new UnauthorizedError("Você não tem permissão para deletar essa loja"));
    }

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Nenhuma loja foi encontrada com o ID: " + id));
    }

    return success(store);
  }
}

export { DeleteStoreService };
