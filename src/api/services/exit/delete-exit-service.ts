import { z } from "zod";
import { Exit } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { EExitResponse } from "../../interfaces/IExit";
import { ExitRepository } from "../../repositories/ExitRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { Either, failure, success } from "../../errors/either";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

class DeleteExitService {
  constructor(private exitRepository: ExitRepository) {}

  public async execute(
    id: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, Exit>> {
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

      return failure(new BadRequestError(exitError.message));
    }

    const exit = await this.exitRepository.delete(id, infosToken.id);

    if (exit === EExitResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError("Você não tem permissão para deletar uma saída dessa loja")
      );
    }

    if (exit === EExitResponse.ExitNotFound) {
      return failure(new NotFoundError("Nenhuma saída foi encontrada com o ID: " + id));
    }

    return success(exit);
  }
}

export { DeleteExitService };
