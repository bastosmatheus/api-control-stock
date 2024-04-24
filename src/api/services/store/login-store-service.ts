import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { NotFoundError } from "../../errors/NotFoundError";
import { EStoreResponse } from "../../interfaces/IStore";
import { StoreRepository } from "../../repositories/StoreRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { Either, failure, success } from "../../errors/either";

class LoginStoreService {
  constructor(private storeRepository: StoreRepository) {}

  public async execute(
    email: string,
    password: string
  ): Promise<Either<BadRequestError | NotFoundError | UnauthorizedError, string>> {
    const loginSchema = z.object({
      email: z
        .string({
          required_error: "Informe o email",
          invalid_type_error: "O email deve ser uma string",
        })
        .email({ message: "Digite um email válido" }),
      password: z
        .string({
          required_error: "Informe a senha",
          invalid_type_error: "A senha deve ser uma string",
        })
        .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
    });

    const loginValidation = loginSchema.safeParse({ email, password });

    if (!loginValidation.success) {
      const loginError = loginValidation.error.errors[0];

      return failure(new BadRequestError(loginError.message));
    }

    const store = await this.storeRepository.login(email);

    if (store === EStoreResponse.StoreNotFound) {
      return failure(new NotFoundError("Email inválido"));
    }

    const checkPassword = await bcrypt.compare(password, store.password);

    if (!checkPassword) {
      return failure(new UnauthorizedError("Senha inválida"));
    }

    const token = jwt.sign(
      { name_store: store.name_store, id: store.id },
      process.env.JWT_PASS as string,
      {
        expiresIn: "30d",
      }
    );

    return success(token);
  }
}

export { LoginStoreService };
