import { z } from "zod";
import { DefectiveProduct } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { EDefectiveProductResponse } from "../interfaces/IDefectiveProduct";
import { DefectiveProductRepository } from "../repositories/DefectiveProductRepository";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";
import { Either, failure, success } from "../errors/either";

class DefectiveProductService {
  private readonly defectiveProductRepository = new DefectiveProductRepository();

  public async getAll(): Promise<DefectiveProduct[]> {
    const defectiveProducts = await this.defectiveProductRepository.getAll();

    return defectiveProducts;
  }

  public async getById(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, DefectiveProduct>> {
    const defectiveProductsSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const defectiveProductsValidation = defectiveProductsSchema.safeParse({
      id,
    });

    if (!defectiveProductsValidation.success) {
      const defectiveProductsError = defectiveProductsValidation.error.errors[0];

      return failure(new UnprocessableEntityError(defectiveProductsError.message));
    }

    const defectiveProduct = await this.defectiveProductRepository.getById(id);

    if (defectiveProduct === EDefectiveProductResponse.DefectiveProductNotFound) {
      return failure(
        new NotFoundError("Nenhuma produto defeituoso foi encontrada com o ID: " + id)
      );
    }

    return success(defectiveProduct);
  }

  public async create(
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, DefectiveProduct>> {
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

      return failure(new UnprocessableEntityError(defectiveProductsError.message));
    }

    const defectiveProduct = await this.defectiveProductRepository.create(
      description,
      quantity_products,
      id_entrance
    );

    if (defectiveProduct === EDefectiveProductResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id_entrance));
    }

    return success(defectiveProduct);
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_entrance: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, DefectiveProduct>> {
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
      id_entrance: z
        .number({
          required_error: "O ID da entrada é obrigatório",
          invalid_type_error: "O ID da entrada deve ser um número",
        })
        .min(1, { message: "O ID da entrada não pode ser menor que 1" }),
    });

    const defectiveProductsValidation = defectiveProductsSchema.safeParse({
      id,
      description,
      quantity_products,
      id_entrance,
    });

    if (!defectiveProductsValidation.success) {
      const defectiveProductsError = defectiveProductsValidation.error.errors[0];

      return failure(new UnprocessableEntityError(defectiveProductsError.message));
    }

    const DefectiveProduct = await this.defectiveProductRepository.update(
      id,
      description,
      quantity_products,
      id_entrance
    );

    if (DefectiveProduct === EDefectiveProductResponse.EntranceNotFound) {
      return failure(new NotFoundError("Nenhuma entrada foi encontrada com o ID: " + id_entrance));
    }

    if (DefectiveProduct === EDefectiveProductResponse.DefectiveProductNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(DefectiveProduct);
  }

  public async delete(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, DefectiveProduct>> {
    const defectiveProductsSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const defectiveProductsValidation = defectiveProductsSchema.safeParse({
      id,
    });

    if (!defectiveProductsValidation.success) {
      const defectiveProductsError = defectiveProductsValidation.error.errors[0];

      return failure(new UnprocessableEntityError(defectiveProductsError.message));
    }

    const DefectiveProduct = await this.defectiveProductRepository.delete(id);

    if (DefectiveProduct === EDefectiveProductResponse.DefectiveProductNotFound) {
      return failure(new NotFoundError("Nenhuma devolução foi encontrada com o ID: " + id));
    }

    return success(DefectiveProduct);
  }
}

export { DefectiveProductService };
