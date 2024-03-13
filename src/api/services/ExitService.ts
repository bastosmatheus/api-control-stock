import { z } from "zod";
import { Exit } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { EExitResponse } from "../interfaces/IExit";
import { ConflictError } from "../errors/ConflictError";
import { ExitRepository } from "../repositories/ExitRepository";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";
import { Either, failure, success } from "../errors/either";

class ExitService {
  private readonly exitRepository = new ExitRepository();

  public async getAll(): Promise<Exit[]> {
    const entrances = await this.exitRepository.getAll();

    return entrances;
  }

  public async getById(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Exit>> {
    const exitSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const exitValidation = exitSchema.safeParse({
      id,
    });

    if (!exitValidation.success) {
      const exitError = exitValidation.error.errors[0];

      return failure(new UnprocessableEntityError(exitError.message));
    }

    const exit = await this.exitRepository.getById(id);

    if (exit === EExitResponse.ExitNotFound) {
      return failure(new NotFoundError("Nenhuma saída foi encontrada com o ID: " + id));
    }

    return success(exit);
  }

  public async create(
    description: string,
    quantity_products: number,
    id_product: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError | ConflictError, Exit>> {
    const exitSchema = z.object({
      description: z
        .string({
          required_error: "Faça uma descrição para a saída do(s) produto(s)",
          invalid_type_error: "A descrição da saída do(s) produto(s) deve ser uma string",
        })
        .min(5, { message: "A descrição deve ter pelo menos 5 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de produtos vendidos (saída)",
          invalid_type_error: "A quantidade de produtos vendidos deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos vendidos não pode ser menor que 1" }),
      id_product: z
        .number({
          required_error: "O ID do produto é obrigatório",
          invalid_type_error: "O ID do produto deve ser um número",
        })
        .min(1, { message: "O ID do produto não pode ser menor que 1" }),
    });

    const exitValidation = exitSchema.safeParse({ description, quantity_products, id_product });

    if (!exitValidation.success) {
      const exitError = exitValidation.error.errors[0];

      return failure(new UnprocessableEntityError(exitError.message));
    }

    const exit = await this.exitRepository.create(description, quantity_products, id_product);

    if (exit === EExitResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id_product));
    }

    if (exit === EExitResponse.NoStock) {
      return failure(
        new ConflictError(
          "Não é possível efetuar a saída, pois não tem estoque suficiente deste produto"
        )
      );
    }

    return success(exit);
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_product: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError | ConflictError, Exit>> {
    const exitSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      description: z
        .string({
          required_error: "Faça uma descrição para a saída do(s) produto(s)",
          invalid_type_error: "A descrição da saída do(s) produto(s) deve ser uma string",
        })
        .min(5, { message: "A descrição deve ter pelo menos 5 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de produtos vendidos (saída)",
          invalid_type_error: "A quantidade de produtos vendidos deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos não pode ser menor que 1" }),
      id_product: z
        .number({
          required_error: "O ID do produto é obrigatório",
          invalid_type_error: "O ID do produto deve ser um número",
        })
        .min(1, { message: "O ID do produto não pode ser menor que 1" }),
    });

    const exitValidation = exitSchema.safeParse({ id, description, quantity_products, id_product });

    if (!exitValidation.success) {
      const exitError = exitValidation.error.errors[0];

      return failure(new UnprocessableEntityError(exitError.message));
    }

    const exit = await this.exitRepository.update(id, description, quantity_products, id_product);

    if (exit === EExitResponse.ExitNotFound) {
      return failure(new NotFoundError("Nenhuma saída foi encontrada com o ID: " + id));
    }

    if (exit === EExitResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id_product));
    }

    if (exit === EExitResponse.NoStock) {
      return failure(
        new ConflictError(
          "Não é possível efetuar a saída, pois não tem estoque suficiente deste produto"
        )
      );
    }

    return success(exit);
  }

  public async delete(id: number): Promise<Either<UnprocessableEntityError | NotFoundError, Exit>> {
    const exitSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const exitValidation = exitSchema.safeParse({
      id,
    });

    if (!exitValidation.success) {
      const exitError = exitValidation.error.errors[0];

      return failure(new UnprocessableEntityError(exitError.message));
    }

    const exit = await this.exitRepository.delete(id);

    if (exit === EExitResponse.ExitNotFound) {
      return failure(new NotFoundError("Nenhuma saída encontrada com o ID: " + id));
    }

    return success(exit);
  }
}

export { ExitService };
