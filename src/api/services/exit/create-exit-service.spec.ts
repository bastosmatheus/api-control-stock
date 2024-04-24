import { describe, it, beforeEach, expect } from "vitest";
import { CreateExitService } from "./create-exit-service";
import { InMemoryExitRepository } from "../../repositories/in-memory/in-memory-exit-repository";
import { Failure, Success } from "../../errors/either";

let exitRepository: InMemoryExitRepository;
let createExitService: CreateExitService;

describe("create exit", () => {
  beforeEach(() => {
    exitRepository = new InMemoryExitRepository();
    createExitService = new CreateExitService(exitRepository);
  });

  it("should be able to create an exit", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

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

  it("should not be able to create an exit if the id store token is different from the id store of product", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", 1000, 120, 1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("Você não tem permissão para criar uma nova saída nessa loja");
  });

  it("should not be able to create an exit, no stock for this product", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", 1000, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe(
      "Não é possível efetuar a saída, pois não tem estoque suficiente deste produto"
    );
  });

  it("should not be able to create an exit if the field description is a different type of string", async () => {
    const exit = await createExitService.execute(12020, 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("A descrição da saída do(s) produto(s) deve ser uma string");
  });

  it("should not be able to create an exit if the field quantity products is a different type of number", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", "100", 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("A quantidade de produtos vendidos deve ser um número");
  });

  it("should not be able to create an exit if the field price total is a different type of number", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", 100, "120", 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O preço total deve ser um número");
  });

  it("should not be able to create an exit if the field product id is a different type of number", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", 100, 120, "1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID do produto deve ser um número");
  });

  it("should not be able to create an exit if the field product id is empty", async () => {
    const exit = await createExitService.execute("Pessoa comprou o produto", 100, 120);

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID do produto é obrigatório");
  });
});
