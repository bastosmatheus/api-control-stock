import { Failure, Success } from "../../errors/either";
import { UpdateDefectiveProductService } from "./update-defective-product-service";
import { CreateDefectiveProductService } from "./create-defective-product-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDefectiveProductRepository } from "../../repositories/in-memory/in-memory-defective-product-repository";

let defectiveProductRepository: InMemoryDefectiveProductRepository;
let createDefectiveProductService: CreateDefectiveProductService;
let updateDefectiveProductService: UpdateDefectiveProductService;

describe("update a defective product", () => {
  beforeEach(() => {
    defectiveProductRepository = new InMemoryDefectiveProductRepository();
    createDefectiveProductService = new CreateDefectiveProductService(defectiveProductRepository);
    updateDefectiveProductService = new UpdateDefectiveProductService(defectiveProductRepository);
  });

  it("should be able to update a defective product", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(
      1,
      "Produto está com defeito na parte de trás da camiseta",
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
      description: "Produto está com defeito na parte de trás da camiseta",
      quantity_products: 1,
      id_entrance: 1,
    });
  });

  it("should not be able to update a defective product if the id store token is different from the id store of product", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(
      1,
      "Produto está com defeito na parte de trás da camiseta",
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
      "Você não tem permissão para atualizar um relatório de produto defeituoso dessa loja"
    );
  });

  it("should not be able to update a defective product if the id field is empty", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute();

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to update a defective product if the id field is a different type of number", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute("1");

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to update a defective product if the id field is empty", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute();

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to update a defective product if the id field is a different type of number", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute("1");

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to update a defective product if the entrance id field is a different type of number", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(
      10,
      "Produto está com defeito na parte de trás da camiseta",
      1,
      "10",
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID da entrada deve ser um número");
  });

  it("should not be able to update a defective product if the entrance quantity of products field is a different type of number", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(
      10,
      "Produto está com defeito na parte de trás da camiseta",
      "255",
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

  it("should not be able to update a defective product if the description field is a different type of string", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(1, 203050, 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe(
      "A descrição do defeito do produto deve ser uma string"
    );
  });

  it("should not be able to update a defective product if the id field is less then 1", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(0);

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to update a defective product if the product is not found", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProduct = await updateDefectiveProductService.execute(
      10,
      "Produto está com defeito na parte de trás da camiseta",
      1,
      1,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(defectiveProduct).toBeInstanceOf(Failure);
    expect(defectiveProduct.value).toHaveProperty("message");
    expect(defectiveProduct.value.message).toBe(
      "Nenhum produto defeituoso foi encontrado com o ID: 10"
    );
  });
});
