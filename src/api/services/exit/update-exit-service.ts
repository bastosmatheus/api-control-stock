import { z } from "zod";
import { Exit } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";
import { EExitResponse } from "../../interfaces/IExit";
import { ExitRepository } from "../../repositories/ExitRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { Either, failure, success } from "../../errors/either";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

class UpdateExitService {
  constructor(private exitRepository: ExitRepository) {}

  public async execute(
    id: number,
    description: string,
    quantity_products: number,
    price_total: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError | ConflictError, Exit>> {
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
        .min(1, { message: "A quantidade de produtos vendidos não pode ser menor que 1" }),
      price_total: z.number({
        required_error: "Informe o preço total da saída",
        invalid_type_error: "O preço total deve ser um número",
      }),
    });

    const exitValidation = exitSchema.safeParse({
      id,
      description,
      quantity_products,
      price_total,
    });

    if (!exitValidation.success) {
      const exitError = exitValidation.error.errors[0];

      return failure(new BadRequestError(exitError.message));
    }

    const exit = await this.exitRepository.update(
      id,
      description,
      quantity_products,
      price_total,
      infosToken.id
    );

    if (exit === EExitResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError("Você não tem permissão para atualizar uma saída dessa loja")
      );
    }

    if (exit === EExitResponse.ExitNotFound) {
      return failure(new NotFoundError("Nenhuma saída foi encontrada com o ID: " + id));
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
}

export { UpdateExitService };
