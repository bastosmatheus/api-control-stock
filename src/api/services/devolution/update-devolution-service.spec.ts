import { Failure, Success } from "../../errors/either";
import { UpdateDevolutionService } from "./update-devolution-service";
import { CreateDevolutionService } from "./create-devolution-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDevolutionRepository } from "../../repositories/in-memory/in-memory-devolution-repository";

let devolutionRepository: InMemoryDevolutionRepository;
let createDevolutionService: CreateDevolutionService;
let updateDevolutionService: UpdateDevolutionService;

describe("update a devolution", () => {
  beforeEach(() => {
    devolutionRepository = new InMemoryDevolutionRepository();
    createDevolutionService = new CreateDevolutionService(devolutionRepository);
    updateDevolutionService = new UpdateDevolutionService(devolutionRepository);
  });

  it("should be able to update a devolution", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute(
      1,
      "Produto está com defeito na parte de trás da camiseta",
      1,
      1,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(devolution).toBeInstanceOf(Success);
    expect(devolution.value).toEqual({
      id: 1,
      description: "Produto está com defeito na parte de trás da camiseta",
      quantity_products: 1,
      devolution_date: new Date("2020-02-10"),
      id_entrance: 1,
    });
  });

  it("should not be able to update a devolution if the id field is empty", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute();

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to update a devolution if the id field is a different type of number", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute("1");

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to update a devolution if the entrance id field is a different type of number", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute(
      10,
      "Produto está com defeito na parte de trás da camiseta",
      1,
      "10",
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID da entrada deve ser um número");
  });

  it("should not be able to update a devolution if the entrance quantity of products field is a different type of number", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute(
      10,
      "Produto está com defeito na parte de trás da camiseta",
      "255",
      1,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("A quantidade de devoluções deve ser um número");
  });

  it("should not be able to update a devolution if the description field is a different type of string", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute(1, 203050, 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("A descrição do motivo da devolução deve ser uma string");
  });

  it("should not be able to update a devolution if the id field is less then 1", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute(0);

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to update a devolution if the devolution is not found", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await updateDevolutionService.execute(
      10,
      "Produto está com defeito na parte de trás da camiseta",
      1,
      1,
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("Nenhuma devolução foi encontrada com o ID: 10");
  });
});
