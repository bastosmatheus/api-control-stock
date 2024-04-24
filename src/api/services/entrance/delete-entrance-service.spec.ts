import { Failure, Success } from "../../errors/either";
import { DeleteEntranceService } from "./delete-entrance-service";
import { CreateEntranceService } from "./create-entrance-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryEntranceRepository } from "../../repositories/in-memory/in-memory-entrance-repository";

let entranceRepository: InMemoryEntranceRepository;
let createEntranceService: CreateEntranceService;
let deleteEntranceService: DeleteEntranceService;

describe("delete entrance", () => {
  beforeEach(() => {
    entranceRepository = new InMemoryEntranceRepository();
    createEntranceService = new CreateEntranceService(entranceRepository);
    deleteEntranceService = new DeleteEntranceService(entranceRepository);
  });

  it("should be able to delete a entrance", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await deleteEntranceService.execute(1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Success);
    expect(entrance.value).toEqual({
      id: 1,
      supplier: "mT fornecedor",
      quantity_products: 100,
      price_total: 1050,
      entrance_date: new Date("2020-02-10"),
      id_product: 1,
    });
  });

  it("should not be able to delete a entrance if the id store token is different from the id store of product", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await deleteEntranceService.execute(1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe(
      "Você não tem permissão para deletar uma entrada dessa loja"
    );
  });

  it("should not be able to delete a entrance if the id field is empty", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await deleteEntranceService.execute();

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to delete a entrance if the id field is a different type of number", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await deleteEntranceService.execute("1", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to delete a entrance if the id field is less then 1", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await deleteEntranceService.execute(0, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to delete a entrance if the product is not found", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await deleteEntranceService.execute(10, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("Nenhuma entrada foi encontrada com o ID: 10");
  });
});
