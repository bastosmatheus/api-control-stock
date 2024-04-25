import { z } from "zod";
import { Devolution } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { EDevolutionResponse } from "../../interfaces/IDevolution";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { Either, failure, success } from "../../errors/either";

class UpdateDevolutionService {
  constructor(private devolutionRepository: DevolutionRepository) {}

  public async execute(
    id: number,
    description: string,
    quantity_products: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, Devolution>> {
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
    });

    const devolutionValidation = devolutionSchema.safeParse({
      id,
      description,
      quantity_products,
    });

    if (!devolutionValidation.success) {
      const devolutionError = devolutionValidation.error.errors[0];

      return failure(new BadRequestError(devolutionError.message));
    }

    const devolution = await this.devolutionRepository.update(
      id,
      description,
      quantity_products,
      infosToken.id
    );

    if (devolution === EDevolutionResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError(
          "Você não tem permissão para atualizar um relatório de devolução dessa loja"
        )
      );
    }

    if (devolution === EDevolutionResponse.DevolutionNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(devolution);
  }
}

export { UpdateDevolutionService };
