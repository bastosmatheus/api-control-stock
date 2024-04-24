import { Failure, Success } from "../../errors/either";
import { DeleteDevolutionService } from "./delete-devolution-service";
import { CreateDevolutionService } from "./create-devolution-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDevolutionRepository } from "../../repositories/in-memory/in-memory-devolution-repository";

let devolutionRepository: InMemoryDevolutionRepository;
let createDevolutionService: CreateDevolutionService;
let deleteDevolutionService: DeleteDevolutionService;

describe("delete devolution", () => {
  beforeEach(() => {
    devolutionRepository = new InMemoryDevolutionRepository();
    createDevolutionService = new CreateDevolutionService(devolutionRepository);
    deleteDevolutionService = new DeleteDevolutionService(devolutionRepository);
  });

  it("should be able to delete a devolution", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await deleteDevolutionService.execute(1, {
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

  it("should not be able to delete a devolution if the id store token is different from the id store of product", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await deleteDevolutionService.execute(1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe(
      "Você não tem permissão para deletar um relatório de devolução dessa loja"
    );
  });

  it("should not be able to delete a devolution if the id field is empty", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await deleteDevolutionService.execute();

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to delete a devolution if the id field is a different type of number", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await deleteDevolutionService.execute("1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to delete a devolution if the id field is less then 1", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await deleteDevolutionService.execute(0, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to delete a devolution if the product is not found", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await deleteDevolutionService.execute(10, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("Nenhuma devolução foi encontrada com o ID: 10");
  });
});
