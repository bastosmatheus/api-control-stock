import bcrypt from "bcrypt";
import { z } from "zod";
import { Store } from "@prisma/client";
import { ConflictError } from "../../errors/ConflictError";
import { EStoreResponse } from "../../interfaces/IStore";
import { StoreRepository } from "../../repositories/StoreRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { Either, failure, success } from "../../errors/either";

class CreateStoreService {
  constructor(private storeRepository: StoreRepository) {}

  public async execute(
    name_store: string,
    email: string,
    password: string
  ): Promise<Either<BadRequestError | ConflictError, Store>> {
    const storeSchema = z.object({
      name_store: z.string({
        required_error: "Informe o nome da loja",
        invalid_type_error: "O nome da loja deve ser uma string",
      }),
      email: z
        .string({
          required_error: "Informe o email da loja",
          invalid_type_error: "O email da loja deve ser uma string",
        })
        .email({
          message: "Endereço de email inválido",
        }),
      password: z
        .string({
          required_error: "Informe a senha da loja",
          invalid_type_error: "A senha da loja deve ser uma string",
        })
        .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
    });

    const storeValidation = storeSchema.safeParse({ name_store, email, password });

    if (!storeValidation.success) {
      const storeError = storeValidation.error.errors[0];

      return failure(new BadRequestError(storeError.message));
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const store = await this.storeRepository.create(name_store, email, passwordHash);

    if (store === EStoreResponse.NameStoreExists) {
      return failure(new ConflictError("Já existe uma loja com esse nome: " + name_store));
    }

    if (store === EStoreResponse.EmailExists) {
      return failure(new ConflictError("Esse email já foi cadastrado"));
    }

    return success(store);
  }
}

export { CreateStoreService };
