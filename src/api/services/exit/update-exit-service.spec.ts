import { describe, it, beforeEach, expect } from "vitest";
import { CreateExitService } from "./create-exit-service";
import { InMemoryExitRepository } from "../../repositories/in-memory/in-memory-exit-repository";
import { Failure, Success } from "../../errors/either";
import { UpdateExitService } from "./update-exit-service";

let exitRepository: InMemoryExitRepository;
let createExitService: CreateExitService;
let updateExitService: UpdateExitService;

describe("update exit", () => {
  beforeEach(() => {
    exitRepository = new InMemoryExitRepository();
    createExitService = new CreateExitService(exitRepository);
    updateExitService = new UpdateExitService(exitRepository);
  });

  it("should be able to update an exit", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await updateExitService.execute(1, "Animal comprou o produto", 2, 240, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Success);
    expect(exit.value).toEqual({
      id: 1,
      description: "Animal comprou o produto",
      price_total: 240,
      quantity_products: 2,
      exit_date: new Date("2020-02-10"),
      id_product: 1,
    });
  });

  it("should not be able to update an exit if the id store token is different from the id store of product", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await updateExitService.execute(1, "Animal comprou o produto", 2, 240, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("Você não tem permissão para atualizar uma saída dessa loja");
  });

  it("should not be able to update an exit, no stock for this product", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await updateExitService.execute(1, "Animal comprou o produto", 2000, 240, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe(
      "Não é possível efetuar a saída, pois não tem estoque suficiente deste produto"
    );
  });

  it("should not be able to update an exit if the field description is a different type of string", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await updateExitService.execute(1, 205030, 1, 240, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("A descrição da saída do(s) produto(s) deve ser uma string");
  });

  it("should not be able to update an exit if the field quantity products is a different type of number", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await updateExitService.execute(1, "Animal comprou o produto", "2000", 240, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("A quantidade de produtos vendidos deve ser um número");
  });

  it("should not be able to update an exit if the field price total is a different type of number", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await updateExitService.execute(1, "Animal comprou o produto", 1, "240", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O preço total deve ser um número");
  });
});
