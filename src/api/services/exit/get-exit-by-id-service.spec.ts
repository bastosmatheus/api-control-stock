import { Failure, Success } from "../../errors/either";
import { GetExitByIdService } from "./get-exit-by-id-service";
import { CreateExitService } from "./create-exit-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryExitRepository } from "../../repositories/in-memory/in-memory-exit-repository";

let exitRepository: InMemoryExitRepository;
let createExitService: CreateExitService;
let getExitByIdService: GetExitByIdService;

describe("get one exit", () => {
  beforeEach(() => {
    exitRepository = new InMemoryExitRepository();
    createExitService = new CreateExitService(exitRepository);
    getExitByIdService = new GetExitByIdService(exitRepository);
  });

  it("should be able to get an exit by id", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await getExitByIdService.execute(1);

    expect(exit).toBeInstanceOf(Success);
    expect(exit.value).toEqual({
      id: 1,
      description: "Pessoa comprou o produto",
      price_total: 120,
      quantity_products: 1,
      exit_date: new Date("2020-02-10"),
      id_product: 1,
    });
  });

  it("should not be able to get an exit if the id field is empty", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await getExitByIdService.execute();

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to get an exit if the id field is a different type of number", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await getExitByIdService.execute("1");

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to get an exit if the id field is less then 1", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await getExitByIdService.execute(0);

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to get an exit if the exit is not found", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await getExitByIdService.execute(10);

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("Nenhuma saída foi encontrada com o ID: 10");
  });
});
