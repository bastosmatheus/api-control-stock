import { z } from "zod";
import { Entrance } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { EEntranceResponse } from "../interfaces/IEntrance";
import { EntranceRepository } from "../repositories/EntranceRepository";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";
import { Either, failure, success } from "../errors/either";

class EntranceService {
  private readonly entranceRepository = new EntranceRepository();

  public async getAll(): Promise<Entrance[]> {
    const entrances = await this.entranceRepository.getAll();

    return entrances;
  }

  public async getById(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Entrance>> {
    const entranceSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const entranceValidation = entranceSchema.safeParse({ id });

    if (!entranceValidation.success) {
      const entranceError = entranceValidation.error.errors[0];

      return failure(new UnprocessableEntityError(entranceError.message));
    }

    const entrance = await this.entranceRepository.getById(id);

    if (entrance === EEntranceResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id));
    }

    return success(entrance);
  }

  public async create(
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Entrance>> {
    const entranceSchema = z.object({
      supplier: z
        .string({
          required_error: "Informe a fornecedora do produto",
          invalid_type_error: "O nome da fornecedora deve ser uma string",
        })
        .min(2, { message: "O nome da fornecedora deve ter pelo menos 2 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de produtos do lote (entrada)",
          invalid_type_error: "A quantidade de produtos deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos não pode ser menor que 1" }),
      price_total: z
        .number({
          required_error: "Informe o preço total do lote (entrada)",
          invalid_type_error: "O preço total deve ser um número",
        })
        .min(0.05, { message: "O preço total da entrada deve ser maior que 0.05" }),
      id_product: z
        .number({
          required_error: "O ID do produto é obrigatório",
          invalid_type_error: "O ID do produto deve ser um número",
        })
        .min(1, { message: "O ID do produto não pode ser menor que 1" }),
    });

    const entranceValidation = entranceSchema.safeParse({
      supplier,
      quantity_products,
      price_total,
      id_product,
    });

    if (!entranceValidation.success) {
      const entranceError = entranceValidation.error.errors[0];

      return failure(new UnprocessableEntityError(entranceError.message));
    }

    const entrance = await this.entranceRepository.create(
      supplier,
      quantity_products,
      price_total,
      id_product
    );

    if (entrance === EEntranceResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id_product));
    }

    return success(entrance);
  }

  public async update(
    id: number,
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Entrance>> {
    const entranceSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      supplier: z
        .string({
          required_error: "Informe a fornecedora do produto",
          invalid_type_error: "O nome da fornecedora deve ser uma string",
        })
        .min(2, { message: "O nome da fornecedora deve ter pelo menos 2 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de produtos do lote (entrada)",
          invalid_type_error: "A quantidade de produtos deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos não pode ser menor que 1" }),
      price_total: z
        .number({
          required_error: "Informe o preço total do lote (entrada)",
          invalid_type_error: "O preço total deve ser um número",
        })
        .min(0.05, { message: "O preço total da entrada deve ser maior que 0.05" }),
      id_product: z
        .number({
          required_error: "O ID do produto é obrigatório",
          invalid_type_error: "O ID do produto deve ser um número",
        })
        .min(1, { message: "O ID do produto não pode ser menor que 1" }),
    });

    const entranceValidation = entranceSchema.safeParse({
      id,
      supplier,
      quantity_products,
      price_total,
      id_product,
    });

    if (!entranceValidation.success) {
      const entranceError = entranceValidation.error.errors[0];

      return failure(new UnprocessableEntityError(entranceError.message));
    }

    const entrance = await this.entranceRepository.update(
      id,
      supplier,
      quantity_products,
      price_total,
      id_product
    );

    if (entrance === EEntranceResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id));
    }

    if (entrance === EEntranceResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(entrance);
  }

  public async delete(
    id: number
  ): Promise<Either<UnprocessableEntityError, NotFoundError | Entrance>> {
    const entranceSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const entranceValidation = entranceSchema.safeParse({ id });

    if (!entranceValidation.success) {
      const entranceError = entranceValidation.error.errors[0];

      return failure(new UnprocessableEntityError(entranceError.message));
    }

    const entrance = await this.entranceRepository.delete(id);

    if (entrance === EEntranceResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id));
    }

    return success(entrance);
  }
}

export { EntranceService };
