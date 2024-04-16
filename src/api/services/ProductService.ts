import { z } from "zod";
import jwt from "jsonwebtoken";
import { Product } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";
import { EProductResponse } from "../interfaces/IProduct";
import { ProductRepository } from "../repositories/ProductRepository";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";
import { Either, failure, success } from "../errors/either";
import { UnauthorizedError } from "../errors/UnauthorizedError";

class ProductService {
  private readonly productRepository = new ProductRepository();

  public async getAll() {
    const products = await this.productRepository.getAll();

    return products;
  }

  public async getById(
    id: number
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Product>> {
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const productValidation = productSchema.safeParse({ id });

    if (!productValidation.success) {
      const productError = productValidation.error.errors[0];

      return failure(new UnprocessableEntityError(productError.message));
    }

    const product = await this.productRepository.getById(id);

    if (product === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }

  public async create(
    name_product: string,
    price_product: number,
    id_store: number,
    token: string
  ): Promise<Either<UnprocessableEntityError | UnauthorizedError | ConflictError, Product>> {
    const productSchema = z.object({
      name_product: z
        .string({
          required_error: "Informe o nome do produto",
          invalid_type_error: "O nome do produto deve ser uma string",
        })
        .min(2, { message: "O nome do produto deve ter pelo menos 2 caracteres" }),
      price_product: z
        .number({
          required_error: "Informe o preço do produto",
          invalid_type_error: "O preço do produto deve ser um número",
        })
        .min(0.05, { message: "O preço do produto deve ser maior que 0.05" }),
      id_store: z
        .number({
          required_error: "O ID da loja é obrigatório",
          invalid_type_error: "O ID da loja deve ser um número",
        })
        .min(1, { message: "O ID da loja não pode ser menor que 1" }),
      token: z.string({
        required_error: "Informe o token de autorização",
        invalid_type_error: "O token de autorização deve ser uma string",
      }),
    });

    const productValidation = productSchema.safeParse({
      name_product,
      price_product,
      id_store,
      token,
    });

    if (!productValidation.success) {
      const productError = productValidation.error.errors[0];

      return failure(new UnprocessableEntityError(productError.message));
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PASS as string, function (err, decoded) {
      if (err && err.message === "jwt malformed") {
        return "Token inválido";
      }

      return decoded;
    });

    if (String(verifyToken) === "Token inválido") {
      return failure(new UnauthorizedError("Token inválido"));
    }

    const product = await this.productRepository.create(name_product, price_product, id_store);

    if (product === EProductResponse.ProductExists) {
      return failure(new ConflictError("Já existe um produto com esse nome: " + name_product));
    }

    if (product === EProductResponse.StoreNotFound) {
      return failure(new ConflictError("Não foi encontrada nenhuma loja com esse ID: " + id_store));
    }

    if (verifyToken.id !== id_store) {
      return failure(new UnauthorizedError("Só é possível criar um produto na sua própria loja"));
    }

    return success(product);
  }

  public async update(
    id: number,
    name_product: string,
    price_product: number,
    token: string
  ): Promise<Either<NotFoundError | ConflictError, Product>> {
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      name_product: z
        .string({
          required_error: "Informe o nome do produto",
          invalid_type_error: "O nome do produto deve ser uma string",
        })
        .min(2, { message: "O nome do produto deve ter pelo menos 2 caracteres" }),
      price_product: z
        .number({
          required_error: "Informe o preço do produto",
          invalid_type_error: "O preço do produto deve ser um número",
        })
        .min(0.05, { message: "O preço do produto deve ser maior que 0.05" }),
      token: z.string({
        required_error: "Informe o token de autorização",
        invalid_type_error: "O token de autorização deve ser uma string",
      }),
    });

    const productValidation = productSchema.safeParse({ id, name_product, price_product, token });

    if (!productValidation.success) {
      const productError = productValidation.error.issues[0];

      return failure(new UnprocessableEntityError(productError.message));
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PASS as string, function (err, decoded) {
      if (err && err.message === "jwt malformed") {
        return "Token inválido";
      }

      return decoded;
    });

    if (String(verifyToken) === "Token inválido") {
      return failure(new UnauthorizedError("Token inválido"));
    }

    const product = await this.productRepository.update(id, name_product, price_product);

    if (product === EProductResponse.ProductExists) {
      return failure(new ConflictError("Já existe um produto com esse nome: " + name_product));
    }

    if (product === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    if (verifyToken.id !== product.id_store) {
      return failure(
        new UnauthorizedError("Só é possível atualizar um produto da sua própria loja")
      );
    }

    return success(product);
  }

  public async delete(
    id: number,
    token: string
  ): Promise<Either<UnprocessableEntityError | NotFoundError, Product>> {
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      token: z.string({
        required_error: "Informe o token de autorização",
        invalid_type_error: "O token de autorização deve ser uma string",
      }),
    });

    const productValidation = productSchema.safeParse({ id, token });

    if (!productValidation.success) {
      const productError = productValidation.error.errors[0];

      return failure(new UnprocessableEntityError(productError.message));
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PASS as string, function (err, decoded) {
      if (err && err.message === "jwt malformed") {
        return "Token inválido";
      }

      return decoded;
    });

    if (String(verifyToken) === "Token inválido") {
      return failure(new UnauthorizedError("Token inválido"));
    }

    const product = await this.productRepository.delete(id);

    if (product === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    if (verifyToken.id !== product.id_store) {
      return failure(new UnauthorizedError("Só é possível excluir um produto da sua própria loja"));
    }

    return success(product);
  }
}

export { ProductService };
