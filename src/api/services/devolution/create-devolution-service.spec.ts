import { Failure, Success } from "../../errors/either";
import { CreateDevolutionService } from "./create-devolution-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDevolutionRepository } from "../../repositories/in-memory/in-memory-devolution-repository";

let devolutionRepository: InMemoryDevolutionRepository;
let createDevolutionService: CreateDevolutionService;

describe("create devolution", () => {
  beforeEach(() => {
    devolutionRepository = new InMemoryDevolutionRepository();
    createDevolutionService = new CreateDevolutionService(devolutionRepository);
  });

  it("should be able to create a devolution", async () => {
    const devolution = await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Success);
    expect(devolution.value).toEqual({
      id: 1,
      description: "Produto veio quebrado",
      quantity_products: 1,
      devolution_date: new Date("2020-02-10"),
      id_entrance: 1,
    });
  });

  it("should not be able to create a devolution if the id store token is different from the id store of product", async () => {
    const devolution = await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe(
      "Você não tem permissão para criar um relatório de devolução nessa loja"
    );
  });

  it("should not be able to create a devolution if the description field is a different type of string", async () => {
    const devolution = await createDevolutionService.execute(102, 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("A descrição do motivo da devolução deve ser uma string");
  });

  it("should not be able to create a devolution if the field entrance id is empty", async () => {
    const devolution = await createDevolutionService.execute("Produto veio quebrado", 1);

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID da entrada é obrigatório");
  });

  it("should not be able to create a devolution if the entrance is not found", async () => {
    const devolution = await createDevolutionService.execute("Produto veio quebrado", 1, 20, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("Nenhuma entrada foi encontrada com o ID: 20");
  });

  it("should not be able to create a devolution if the quantity products is a different type of number", async () => {
    const devolution = await createDevolutionService.execute("Produto veio quebrado", "10", 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("A quantidade de devoluções deve ser um número");
  });
});
