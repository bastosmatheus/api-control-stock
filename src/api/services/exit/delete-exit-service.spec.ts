import { Failure, Success } from "../../errors/either";
import { DeleteExitService } from "./delete-exit-service";
import { CreateExitService } from "./create-exit-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryExitRepository } from "../../repositories/in-memory/in-memory-exit-repository";

let exitRepository: InMemoryExitRepository;
let createExitService: CreateExitService;
let deleteExitService: DeleteExitService;

describe("delete exit", () => {
  beforeEach(() => {
    exitRepository = new InMemoryExitRepository();
    createExitService = new CreateExitService(exitRepository);
    deleteExitService = new DeleteExitService(exitRepository);
  });

  it("should be able to delete a exit", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await deleteExitService.execute(1, {
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

  it("should not be able to delete an exit if the id store token is different from the id store of product", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await deleteExitService.execute(1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("Você não tem permissão para deletar uma saída dessa loja");
  });

  it("should not be able to delete a exit if the id field is empty", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await deleteExitService.execute();

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to delete a exit if the id field is a different type of number", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await deleteExitService.execute("1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to delete a exit if the id field is less then 1", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await deleteExitService.execute(0, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to delete a exit if the product is not found", async () => {
    await createExitService.execute("Pessoa comprou o produto", 1, 120, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exit = await deleteExitService.execute(10, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(exit).toBeInstanceOf(Failure);
    expect(exit.value).toHaveProperty("message");
    expect(exit.value.message).toBe("Nenhuma saída foi encontrada com o ID: 10");
  });
});
