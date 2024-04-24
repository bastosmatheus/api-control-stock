import { z } from "zod";
import { Devolution } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { EDevolutionResponse } from "../../interfaces/IDevolution";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { Either, failure, success } from "../../errors/either";

class CreateDevolutionService {
  constructor(private devolutionRepository: DevolutionRepository) {}

  public async execute(
    description: string,
    quantity_products: number,
    id_entrance: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, Devolution>> {
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

      return failure(new BadRequestError(devolutionError.message));
    }

    const devolution = await this.devolutionRepository.create(
      description,
      quantity_products,
      id_entrance,
      infosToken.id
    );

    if (devolution === EDevolutionResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError(
          "Você não tem permissão para criar um relatório de devolução nessa loja"
        )
      );
    }

    if (devolution === EDevolutionResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id_entrance));
    }

    return success(devolution);
  }
}

export { CreateDevolutionService };
