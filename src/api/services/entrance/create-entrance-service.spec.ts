import { Failure, Success } from "../../errors/either";
import { CreateEntranceService } from "./create-entrance-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryEntranceRepository } from "../../repositories/in-memory/in-memory-entrance-repository";

let entranceRepository: InMemoryEntranceRepository;
let createEntranceService: CreateEntranceService;

describe("create entrance", () => {
  beforeEach(() => {
    entranceRepository = new InMemoryEntranceRepository();
    createEntranceService = new CreateEntranceService(entranceRepository);
  });

  it("should be able to create a entrance", async () => {
    const entrance = await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
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

  it("should not be able to create a entrance if the id store token is different from the id store of product", async () => {
    const entrance = await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 10,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe(
      "Você não tem permissão para criar uma nova entrada nessa loja"
    );
  });

  it("should not be able to create a entrance if the supplier field is a different type of string", async () => {
    const entrance = await createEntranceService.execute(230, 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O nome da fornecedora deve ser uma string");
  });

  it("should not be able to create a entrance if the field product id is empty", async () => {
    const entrance = await createEntranceService.execute("mT fornecedor", 100, 1050);

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID do produto é obrigatório");
  });

  it("should not be able to create a entrance if the product is not found", async () => {
    const entrance = await createEntranceService.execute("mT fornecedor", 100, 1050, 20, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("Nenhum produto foi encontrado com o ID: 20");
  });

  it("should not be able to create a entrance if the quantity products is a different type of number", async () => {
    const entrance = await createEntranceService.execute("mT fornecedor", "100", 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("A quantidade de produtos deve ser um número");
  });
});
