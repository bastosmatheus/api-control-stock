import { z } from "zod";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { DefectiveProduct } from "@prisma/client";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { Either, failure, success } from "../../errors/either";
import { EDefectiveProductResponse } from "../../interfaces/IDefectiveProduct";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";

class UpdateDefectiveProductService {
  constructor(private defectiveProductRepository: DefectiveProductRepository) {}

  public async execute(
    id: number,
    description: string,
    quantity_products: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, DefectiveProduct>> {
    const defectiveProductsSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      description: z
        .string({
          required_error: "Informe o defeito desse produto",
          invalid_type_error: "A descrição do defeito do produto deve ser uma string",
        })
        .min(2, { message: "A descrição deve ter pelo menos 2 caracteres" }),
      quantity_products: z
        .number({
          required_error: "Informe a quantidade de produtos defeituosos",
          invalid_type_error: "A quantidade de produtos defeituosos deve ser um número",
        })
        .min(1, { message: "A quantidade de produtos não pode ser menor que 1" }),
    });

    const defectiveProductsValidation = defectiveProductsSchema.safeParse({
      id,
      description,
      quantity_products,
    });

    if (!defectiveProductsValidation.success) {
      const defectiveProductsError = defectiveProductsValidation.error.errors[0];

      return failure(new BadRequestError(defectiveProductsError.message));
    }

    const defectiveProduct = await this.defectiveProductRepository.update(
      id,
      description,
      quantity_products,
      infosToken.id
    );

    if (defectiveProduct === EDefectiveProductResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError(
          "Você não tem permissão para atualizar um relatório de produto defeituoso dessa loja"
        )
      );
    }

    if (defectiveProduct === EDefectiveProductResponse.DefectiveProductNotFound) {
      return failure(new NotFoundError("Nenhum produto defeituoso foi encontrado com o ID: " + id));
    }

    return success(defectiveProduct);
  }
}

export { UpdateDefectiveProductService };
