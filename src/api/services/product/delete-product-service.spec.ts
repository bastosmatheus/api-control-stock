import { expect, describe, it, beforeEach } from "vitest";
import { CreateProductService } from "./create-product-service";
import { InMemoryProductRepository } from "../../repositories/in-memory/in-memory-product-repository";
import { Failure, Success } from "../../errors/either";
import { DeleteProductService } from "./delete-product-service";

let productRepository: InMemoryProductRepository;
let createProductService: CreateProductService;
let deleteProductService: DeleteProductService;

describe("delete a product", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    createProductService = new CreateProductService(productRepository);
    deleteProductService = new DeleteProductService(productRepository);
  });

  it("should be able to delete a product", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await deleteProductService.execute(1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Success);
    expect(product.value).toEqual({
      id: 1,
      name_product: "Camiseta do Corinthians",
      price_product: 100,
      id_store: 1,
      quantity_product_stock: 100,
    });
  });

  it("should not be able to delete a product if the id store token is different from the id store of product", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await deleteProductService.execute(1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("Você não tem permissão para deletar um produto dessa loja");
  });

  it("should not be able to delete a product if the id field is empty", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await deleteProductService.execute();

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to delete a product if the id field is a different type of number", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await deleteProductService.execute("1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to delete a product if the id field is less then 1", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await deleteProductService.execute(0, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to delete a product if the product is not found", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await deleteProductService.execute(10, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("Nenhum produto foi encontrado com o ID: 10");
  });
});
