import { z } from "zod";
import { Exit } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";
import { EExitResponse } from "../../interfaces/IExit";
import { ExitRepository } from "../../repositories/ExitRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { Either, failure, success } from "../../errors/either";
import { InfosToken } from "../../interfaces/InfosToken";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

class CreateExitService {
  constructor(private exitRepository: ExitRepository) {}

  public async execute(
    description: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError | ConflictError, Exit>> {
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
      price_total: z.number({
        required_error: "Informe o preço total da saída",
        invalid_type_error: "O preço total deve ser um número",
      }),
      id_product: z
        .number({
          required_error: "O ID do produto é obrigatório",
          invalid_type_error: "O ID do produto deve ser um número",
        })
        .min(1, { message: "O ID do produto não pode ser menor que 1" }),
    });

    const exitValidation = exitSchema.safeParse({
      description,
      quantity_products,
      price_total,
      id_product,
    });

    if (!exitValidation.success) {
      const exitError = exitValidation.error.errors[0];

      return failure(new BadRequestError(exitError.message));
    }

    const exit = await this.exitRepository.create(
      description,
      quantity_products,
      price_total,
      id_product,
      infosToken.id
    );

    if (exit === EExitResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError("Você não tem permissão para criar uma nova saída nessa loja")
      );
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
}

export { CreateExitService };
