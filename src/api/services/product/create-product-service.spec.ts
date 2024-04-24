import { expect, describe, it, beforeEach } from "vitest";
import { CreateProductService } from "./create-product-service";
import { InMemoryProductRepository } from "../../repositories/in-memory/in-memory-product-repository";
import { Failure, Success } from "../../errors/either";

let productRepository: InMemoryProductRepository;
let createProductService: CreateProductService;

describe("create a product", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    createProductService = new CreateProductService(productRepository);
  });

  it("should be able to create a product", async () => {
    const product = await createProductService.execute("Camiseta do Corinthians", 100, 1, {
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

  it("should not be able to create a product if the id store token is different from the id store of product", async () => {
    const product = await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("Você não tem permissão para criar um produto nessa loja");
  });

  it("should not be able to create a product if already exists a product with same name", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    await createProductService.execute("Camiseta do Brasil", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const product = await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe(
      "Já existe um produto com esse nome: Camiseta do Corinthians"
    );
  });

  it("should not be able to create a product if the name product field is a different type of string", async () => {
    const product = await createProductService.execute(102030, 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("O nome do produto deve ser uma string");
  });

  it("should not be able to create a product if the price product field is a different type of number", async () => {
    const product = await createProductService.execute("Camiseta do Corinthians", "100", 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("O preço do produto deve ser um número");
  });

  it("should not be able to create a product if the id store field is a different type of number", async () => {
    const product = await createProductService.execute("Camiseta do Corinthians", 100, "1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("O ID da loja deve ser um número");
  });

  it("should not be able to create a product if the store is not found", async () => {
    const product = await createProductService.execute("Camiseta do Corinthians", 100, 10, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(product).toBeInstanceOf(Failure);
    expect(product.value).toHaveProperty("message");
    expect(product.value.message).toBe("Nenhuma loja foi encontrada com o ID: 10");
  });
});
