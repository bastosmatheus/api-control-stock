import { z } from "zod";
import { InfosToken } from "../../interfaces/InfosToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { DefectiveProduct } from "@prisma/client";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { Either, failure, success } from "../../errors/either";
import { EDefectiveProductResponse } from "../../interfaces/IDefectiveProduct";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";

class CreateDefectiveProductService {
  constructor(private defectiveProductRepository: DefectiveProductRepository) {}

  public async execute(
    description: string,
    quantity_products: number,
    id_entrance: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | NotFoundError, DefectiveProduct>> {
    const defectiveProductsSchema = z.object({
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
      id_entrance: z
        .number({
          required_error: "O ID da entrada é obrigatório",
          invalid_type_error: "O ID da entrada deve ser um número",
        })
        .min(1, { message: "O ID da entrada não pode ser menor que 1" }),
    });

    const defectiveProductsValidation = defectiveProductsSchema.safeParse({
      description,
      quantity_products,
      id_entrance,
    });

    if (!defectiveProductsValidation.success) {
      const defectiveProductsError = defectiveProductsValidation.error.errors[0];

      return failure(new BadRequestError(defectiveProductsError.message));
    }

    const defectiveProduct = await this.defectiveProductRepository.create(
      description,
      quantity_products,
      id_entrance,
      infosToken.id
    );

    if (defectiveProduct === EDefectiveProductResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError(
          "Você não tem permissão para criar um relatório de um produto defeituoso nessa loja"
        )
      );
    }

    if (defectiveProduct === EDefectiveProductResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id_entrance));
    }

    return success(defectiveProduct);
  }
}

export { CreateDefectiveProductService };
