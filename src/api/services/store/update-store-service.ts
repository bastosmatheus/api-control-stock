import { z } from "zod";
import { Store } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { ConflictError } from "../../errors/ConflictError";
import { NotFoundError } from "../../errors/NotFoundError";
import { EStoreResponse } from "../../interfaces/IStore";
import { StoreRepository } from "../../repositories/StoreRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { Either, failure, success } from "../../errors/either";

class UpdateStoreService {
  constructor(private storeRepository: StoreRepository) {}

  public async execute(
    id: number,
    name_store: string,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | ConflictError | NotFoundError, Store>> {
    const storeSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      name_store: z.string({
        required_error: "Informe o nome da loja",
        invalid_type_error: "O nome da loja deve ser uma string",
      }),
    });

    const storeValidation = storeSchema.safeParse({ id, name_store });

    if (!storeValidation.success) {
      const storeError = storeValidation.error.errors[0];

      return failure(new BadRequestError(storeError.message));
    }

    const store = await this.storeRepository.update(id, name_store, infosToken.id);

    if (store === EStoreResponse.NotAuthorized) {
      return failure(new UnauthorizedError("Você não tem permissão para atualizar essa loja"));
    }

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Nenhuma loja foi encontrada com o ID: " + id));
    }

    if (store === EStoreResponse.NameStoreExists) {
      return failure(new ConflictError("Esse nome de loja já existe"));
    }

    return success(store);
  }
}

export { UpdateStoreService };
