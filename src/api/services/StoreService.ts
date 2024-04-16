import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Store } from "@prisma/client";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { EStoreResponse } from "../interfaces/IStore";
import { StoreRepository } from "../repositories/StoreRepository";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";
import { Either, failure, success } from "../errors/either";

type StoreWithToken = {
  id: number;
  name_store: string;
  email: string;
  password: string;
  token: string;
};

class StoreService {
  private readonly storeRepository = new StoreRepository();

  public async getAll(): Promise<Store[]> {
    const stores = await this.storeRepository.getAll();

    return stores;
  }

  public async getById(
    id: number
  ): Promise<Either<UnprocessableEntityError | UnauthorizedError | NotFoundError, Store>> {
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

      return failure(new UnprocessableEntityError(storeError.message));
    }

    const store = await this.storeRepository.getById(id);

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Nenhuma loja foi encontrada com o ID: " + id));
    }

    return success(store);
  }

  public async create(
    name_store: string,
    email: string,
    password: string
  ): Promise<Either<UnprocessableEntityError | ConflictError, StoreWithToken>> {
    const storeSchema = z.object({
      name_store: z.string({
        required_error: "Informe o nome da loja",
        invalid_type_error: "O nome da loja deve ser uma string",
      }),
      email: z
        .string({
          required_error: "Informe o email da loja",
          invalid_type_error: "O email deve ser uma string",
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

      return failure(new UnprocessableEntityError(storeError.message));
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const store = await this.storeRepository.create(name_store, email, passwordHash);

    if (store === EStoreResponse.NameStoreExists) {
      return failure(new ConflictError("Esse nome de loja já existe"));
    }

    if (store === EStoreResponse.EmailExists) {
      return failure(new ConflictError("Esse email já foi cadastrado"));
    }

    const token = jwt.sign({ name_store, id: store.id }, process.env.JWT_PASS as string, {
      expiresIn: "30d",
    });

    const storeWithToken = {
      id: store.id,
      name_store: store.name_store,
      email: store.email,
      password: store.password,
      token,
    };

    return success(storeWithToken);
  }

  public async update(
    id: number,
    name_store: string,
    password: string,
    token: string
  ): Promise<
    Either<
      UnprocessableEntityError | UnauthorizedError | ConflictError | NotFoundError,
      StoreWithToken
    >
  > {
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
      password: z
        .string({
          required_error: "Informe a senha da loja",
          invalid_type_error: "A senha da loja deve ser uma string",
        })
        .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
      token: z.string({
        required_error: "Informe o token de autorização",
        invalid_type_error: "O token de autorização deve ser uma string",
      }),
    });

    const storeValidation = storeSchema.safeParse({ id, name_store, password, token });

    if (!storeValidation.success) {
      const storeError = storeValidation.error.errors[0];

      return failure(new UnprocessableEntityError(storeError.message));
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PASS as string, function (err, decoded) {
      if (err && err.message === "jwt malformed") {
        return "Token inválido";
      }

      return decoded;
    });

    if (String(verifyToken) === "Token inválido") {
      return failure(new UnauthorizedError("Token inválido"));
    }

    if (verifyToken.id !== id) {
      return failure(new UnauthorizedError("Você só tem permissão para atualizar o seu perfil"));
    }

    const store = await this.storeRepository.update(id, name_store, password);

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Nenhuma loja foi encontrada com o ID: " + id));
    }

    if (store === EStoreResponse.NameStoreExists) {
      return failure(new ConflictError("Esse nome de loja já existe"));
    }

    const storeWithToken = {
      id: store.id,
      name_store: store.name_store,
      email: store.email,
      password: store.password,
      token,
    };

    return success(storeWithToken);
  }

  public async delete(
    id: number,
    token: string
  ): Promise<Either<NotFoundError | UnauthorizedError | UnprocessableEntityError, Store>> {
    const storeSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      token: z.string({
        required_error: "Informe o token de autorização",
        invalid_type_error: "O token de autorização deve ser uma string",
      }),
    });

    const storeValidation = storeSchema.safeParse({
      id,
      token,
    });

    if (!storeValidation.success) {
      const storeError = storeValidation.error.errors[0];

      return failure(new UnprocessableEntityError(storeError.message));
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PASS as string, function (err, decoded) {
      if (err && err.message === "jwt malformed") {
        return "Token inválido";
      }

      return decoded;
    });

    if (String(verifyToken) === "Token inválido") {
      return failure(new UnauthorizedError("Token inválido"));
    }

    if (verifyToken.id !== id) {
      return failure(new UnauthorizedError("Você só tem permissão para excluir o seu perfil"));
    }

    const store = await this.storeRepository.delete(id);

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Nenhuma loja foi encontrada com o ID: " + id));
    }

    return success(store);
  }
}

export { StoreService };
