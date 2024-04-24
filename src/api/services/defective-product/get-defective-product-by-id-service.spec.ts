import { Failure, Success } from "../../errors/either";
import { GetDefectiveProductByIdService } from "./get-defective-product-by-id-service";
import { CreateDefectiveProductService } from "./create-defective-product-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDefectiveProductRepository } from "../../repositories/in-memory/in-memory-defective-product-repository";

let defectiveProductRepository: InMemoryDefectiveProductRepository;
let createDefectiveProductService: CreateDefectiveProductService;
let getDefectiveProductByIdService: GetDefectiveProductByIdService;

describe("get one defective product by id", () => {
  beforeEach(() => {
    defectiveProductRepository = new InMemoryDefectiveProductRepository();
    createDefectiveProductService = new CreateDefectiveProductService(defectiveProductRepository);
    getDefectiveProductByIdService = new GetDefectiveProductByIdService(defectiveProductRepository);
  });

  it("should be able to get a defective product by id", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await getDefectiveProductByIdService.execute(1);

    expect(defectiveProduct).toBeInstanceOf(Success);
    expect(defectiveProduct.value).toEqual({
      id: 1,
      description: "Produto veio quebrado",
      quantity_products: 1,
      id_entrance: 1,
    });
  });

  it("should not be able to get a defective product if the id field is empty", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await getDefectiveProductByIdService.execute();

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to get a defective product if the id field is a different type of number", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await getDefectiveProductByIdService.execute("1");

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to get a defective product if the id field is less then 1", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await getDefectiveProductByIdService.execute(0);

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to get a defective product if the product is not found", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await getDefectiveProductByIdService.execute(10);

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe(
      "Nenhum produto defeituoso foi encontrado com o ID: 10"
    );
  });
});
