import { Failure, Success } from "../../errors/either";
import { CreateDefectiveProductService } from "./create-defective-product-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDefectiveProductRepository } from "../../repositories/in-memory/in-memory-defective-product-repository";

let defectiveProductRepository: InMemoryDefectiveProductRepository;
let createDefectiveProductService: CreateDefectiveProductService;

describe("create defective product", () => {
  beforeEach(() => {
    defectiveProductRepository = new InMemoryDefectiveProductRepository();
    createDefectiveProductService = new CreateDefectiveProductService(defectiveProductRepository);
  });

  it("should be able to create a defective product", async () => {
    const defectiveProduct = await createDefectiveProductService.execute(
      "Produto veio quebrado",
      1,
      1,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(defectiveProduct).toBeInstanceOf(Success);
    expect(defectiveProduct.value).toEqual({
      id: 1,
      description: "Produto veio quebrado",
      quantity_products: 1,
      id_entrance: 1,
    });
  });

  it("should not be able to create a defective product if the id store token is different from the id store of product", async () => {
    const defectiveProduct = await createDefectiveProductService.execute(
      "Produto veio quebrado",
      1,
      1,
      {
        id: 10,
        name_store: "mtCompany",
      }
    );

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toEqual(
      "Você não tem permissão para criar um relatório de um produto defeituoso nessa loja"
    );
  });

  it("should not be able to create a defective product if the description field is a different type of string", async () => {
    const defectiveProduct = await createDefectiveProductService.execute(102, 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe(
      "A descrição do defeito do produto deve ser uma string"
    );
  });

  it("should not be able to create a defective product if the field entrance id is empty", async () => {
    const defectiveProduct = await createDefectiveProductService.execute(
      "Produto veio quebrado",
      1
    );

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID da entrada é obrigatório");
  });

  it("should not be able to create a defective product if the entrance is not found", async () => {
    const defectiveProduct = await createDefectiveProductService.execute(
      "Produto veio quebrado",
      1,
      20,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("Nenhuma entrada foi encontrada com o ID: 20");
  });

  it("should not be able to create a defective product if the quantity products is a different type of number", async () => {
    const defectiveProduct = await createDefectiveProductService.execute(
      "Produto veio quebrado",
      "10",
      1,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe(
      "A quantidade de produtos defeituosos deve ser um número"
    );
  });
});
