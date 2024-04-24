import { Failure, Success } from "../../errors/either";
import { GetDevolutionByIdService } from "./get-devolution-by-id-service";
import { CreateDevolutionService } from "./create-devolution-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDevolutionRepository } from "../../repositories/in-memory/in-memory-devolution-repository";

let devolutionRepository: InMemoryDevolutionRepository;
let createDevolutionService: CreateDevolutionService;
let getDevolutionByIdService: GetDevolutionByIdService;

describe("get one devolution by id", () => {
  beforeEach(() => {
    devolutionRepository = new InMemoryDevolutionRepository();
    createDevolutionService = new CreateDevolutionService(devolutionRepository);
    getDevolutionByIdService = new GetDevolutionByIdService(devolutionRepository);
  });

  it("should be able to get a devolution by id", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await getDevolutionByIdService.execute(1);

    expect(devolution).toBeInstanceOf(Success);
    expect(devolution.value).toEqual({
      id: 1,
      description: "Produto veio quebrado",
      quantity_products: 1,
      devolution_date: new Date("2020-02-10"),
      id_entrance: 1,
    });
  });

  it("should not be able to get a devolution if the id field is empty", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await getDevolutionByIdService.execute();

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to get a devolution if the id field is a different type of number", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await getDevolutionByIdService.execute("1");

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to get a devolution if the id field is less then 1", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await getDevolutionByIdService.execute(0);

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to get a devolution if the product is not found", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolution = await getDevolutionByIdService.execute(10);

    expect(devolution).toBeInstanceOf(Failure);
    expect(devolution.value).toHaveProperty("message");
    expect(devolution.value.message).toBe("Nenhuma devolução foi encontrada com o ID: 10");
  });
});
