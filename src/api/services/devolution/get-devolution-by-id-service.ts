import { z } from "zod";
import { Devolution } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { EDevolutionResponse } from "../../interfaces/IDevolution";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { Either, failure, success } from "../../errors/either";

class GetDevolutionByIdService {
  constructor(private devolutionRepository: DevolutionRepository) {}

  public async execute(id: number): Promise<Either<BadRequestError | NotFoundError, Devolution>> {
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

      return failure(new BadRequestError(devolutionError.message));
    }

    const devolution = await this.devolutionRepository.getById(id);

    if (devolution === EDevolutionResponse.DevolutionNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(devolution);
  }
}

export { GetDevolutionByIdService };
