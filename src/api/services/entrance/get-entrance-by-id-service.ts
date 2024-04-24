import { z } from "zod";
import { Entrance } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { EEntranceResponse } from "../../interfaces/IEntrance";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { Either, failure, success } from "../../errors/either";

class GetEntranceByIdService {
  constructor(private entranceRepository: EntranceRepository) {}

  public async execute(id: number): Promise<Either<BadRequestError, NotFoundError | Entrance>> {
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

    const entrance = await this.entranceRepository.getById(id);

    if (entrance === EEntranceResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id));
    }

    return success(entrance);
  }
}

export { GetEntranceByIdService };
