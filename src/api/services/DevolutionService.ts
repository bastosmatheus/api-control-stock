import { z } from "zod";
import { Devolution } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { EDevolutionResponse } from "../interfaces/IDevolution";
import { DevolutionRepository } from "../repositories/DevolutionRepository";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";
import { Either, failure, success } from "../errors/either";

class DevolutionService {
  private readonly devolutionRepository = new DevolutionRepository();

  public async getAll(): Promise<Devolution[]> {
    const devolutions = await this.devolutionRepository.getAll();

    return devolutions;
  }

  public async getById(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Devolution>> {
    const devolutionSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const devolutionValidation = devolutionSchema.safeParse({
      id,
    });

    if (!devolutionValidation.success) {
      const devolutionError = devolutionValidation.error.errors[0];

      return failure(new UnprocessableEntityError(devolutionError.message));
    }

    const Devolution = await this.devolutionRepository.getById(id);

    if (Devolution === EDevolutionResponse.DevolutionNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(Devolution);
  }

  public async create(
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Devolution>> {
    const devolutionSchema = z.object({
      description: z
        .string({
          required_error: "Descreva o motivo para a devolução do produto",
          invalid_type_error: "A descrição do motivo da devolução deve ser uma string",
        })
        .min(5, { message: "A descrição deve ter pelo menos 5 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de devoluções desse produto",
          invalid_type_error: "A quantidade de devoluções deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos não pode ser menor que 1" }),
      id_entrance: z
        .number({
          required_error: "O ID da entrada é obrigatório",
          invalid_type_error: "O ID da entrada deve ser um número",
        })
        .min(1, { message: "O ID da entrada não pode ser menor que 1" }),
    });

    const devolutionValidation = devolutionSchema.safeParse({
      description,
      quantity_products,
      id_entrance,
    });

    if (!devolutionValidation.success) {
      const devolutionError = devolutionValidation.error.errors[0];

      return failure(new UnprocessableEntityError(devolutionError.message));
    }

    const devolution = await this.devolutionRepository.create(
      description,
      quantity_products,
      id_entrance
    );

    if (devolution === EDevolutionResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id_entrance));
    }

    return success(devolution);
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Devolution>> {
    const devolutionSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      description: z
        .string({
          required_error: "Descreva o motivo para a devolução do produto",
          invalid_type_error: "A descrição do motivo da devolução deve ser uma string",
        })
        .min(5, { message: "A descrição deve ter pelo menos 5 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de devoluções desse produto",
          invalid_type_error: "A quantidade de devoluções deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos não pode ser menor que 1" }),
      id_entrance: z
        .number({
          required_error: "O ID da entrada é obrigatório",
          invalid_type_error: "O ID da entrada deve ser um número",
        })
        .min(1, { message: "O ID da entrada não pode ser menor que 1" }),
    });

    const devolutionValidation = devolutionSchema.safeParse({
      id,
      description,
      quantity_products,
      id_entrance,
    });

    if (!devolutionValidation.success) {
      const devolutionError = devolutionValidation.error.errors[0];

      return failure(new UnprocessableEntityError(devolutionError.message));
    }

    const devolution = await this.devolutionRepository.update(
      id,
      description,
      quantity_products,
      id_entrance
    );

    if (devolution === EDevolutionResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id_entrance));
    }

    if (devolution === EDevolutionResponse.DevolutionNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(devolution);
  }

  public async delete(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Devolution>> {
    const devolutionSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const devolutionValidation = devolutionSchema.safeParse({
      id,
    });

    if (!devolutionValidation.success) {
      const devolutionError = devolutionValidation.error.errors[0];

      return failure(new UnprocessableEntityError(devolutionError.message));
    }

    const devolution = await this.devolutionRepository.delete(id);

    if (devolution === EDevolutionResponse.DevolutionNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(devolution);
  }
}

export { DevolutionService };
