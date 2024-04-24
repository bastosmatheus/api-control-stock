import { Failure, Success } from "../../errors/either";
import { DeleteDefectiveProductService } from "./delete-defective-product-service";
import { CreateDefectiveProductService } from "./create-defective-product-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDefectiveProductRepository } from "../../repositories/in-memory/in-memory-defective-product-repository";

let defectiveProductRepository: InMemoryDefectiveProductRepository;
let createDefectiveProductService: CreateDefectiveProductService;
let deleteDefectiveProductService: DeleteDefectiveProductService;

describe("delete defective product", () => {
  beforeEach(() => {
    defectiveProductRepository = new InMemoryDefectiveProductRepository();
    createDefectiveProductService = new CreateDefectiveProductService(defectiveProductRepository);
    deleteDefectiveProductService = new DeleteDefectiveProductService(defectiveProductRepository);
  });

  it("should be able to delete a defective product", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await deleteDefectiveProductService.execute(1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Success);
    expect(defectiveProduct.value).toEqual({
      id: 1,
      description: "Produto veio quebrado",
      quantity_products: 1,
      id_entrance: 1,
    });
  });

  it("should not be able to delete a defective product if the id store token is different from the id store of product", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await deleteDefectiveProductService.execute(1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toEqual(
      "Você não tem permissão para deletar um relatório de produto defeituoso dessa loja"
    );
  });

  it("should not be able to delete a defective product if the id field is empty", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await deleteDefectiveProductService.execute();

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to delete a defective product if the id field is a different type of number", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await deleteDefectiveProductService.execute("1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to delete a defective product if the id field is less then 1", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await deleteDefectiveProductService.execute(0, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to delete a defective product if the product is not found", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await deleteDefectiveProductService.execute(10, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe(
      "Nenhum produto defeituoso foi encontrado com o ID: 10"
    );
  });
});
