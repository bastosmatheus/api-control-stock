import { z } from "zod";
import { Entrance } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { EEntranceResponse } from "../../interfaces/IEntrance";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { Either, failure, success } from "../../errors/either";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

class DeleteEntranceService {
  constructor(private entranceRepository: EntranceRepository) {}

  public async execute(
    id: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, Entrance>> {
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

      return failure(new BadRequestError(entranceError.message));
    }

    const entrance = await this.entranceRepository.delete(id, infosToken.id);

    if (entrance === EEntranceResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError("Você não tem permissão para deletar uma entrada dessa loja")
      );
    }

    if (entrance === EEntranceResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id));
    }

    return success(entrance);
  }
}

export { DeleteEntranceService };
