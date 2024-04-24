import { Failure, Success } from "../../errors/either";
import { UpdateEntranceService } from "./update-entrance-service";
import { CreateEntranceService } from "./create-entrance-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryEntranceRepository } from "../../repositories/in-memory/in-memory-entrance-repository";

let entranceRepository: InMemoryEntranceRepository;
let createEntranceService: CreateEntranceService;
let updateEntranceService: UpdateEntranceService;

describe("update a entrance", () => {
  beforeEach(() => {
    entranceRepository = new InMemoryEntranceRepository();
    createEntranceService = new CreateEntranceService(entranceRepository);
    updateEntranceService = new UpdateEntranceService(entranceRepository);
  });

  it("should be able to update a entrance", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(1, "romarinho LTDA.", 120, 1100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Success);
    expect(entrance.value).toEqual({
      id: 1,
      supplier: "romarinho LTDA.",
      quantity_products: 120,
      price_total: 1100,
      entrance_date: new Date("2020-02-10"),
      id_product: 1,
    });
  });

  it("should not be able to update a entrance if the id store token is different from the id store of product", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(1, "romarinho LTDA.", 120, 1100, 1, {
      id: 19,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe(
      "Você não tem permissão para atualizar uma entrada dessa loja"
    );
  });

  it("should not be able to update a entrance if the id field is empty", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute();

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to update a entrance if the id field is a different type of number", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute("1");

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to update a entrance if the product id field is a different type of number", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(1, "romarinho LTDA.", 100, 1000, "10", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID do produto deve ser um número");
  });

  it("should not be able to update a entrance if the entrance quantity of products field is a different type of number", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(1, "romarinho LTDA.", "100", 1000, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("A quantidade de produtos deve ser um número");
  });

  it("should not be able to update a entrance if the supplier field is a different type of string", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(1, 203050, 1, 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O nome da fornecedora deve ser uma string");
  });

  it("should not be able to update a entrance if the id field is less then 1", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(0);

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to update a entrance if the product is not found", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrance = await updateEntranceService.execute(1, "romarinho LTDA.", 100, 1000, 120, {
      id: 1,
      name_store: "mtCompany",
    });

    expect(entrance).toBeInstanceOf(Failure);
    expect(entrance.value).toHaveProperty("message");
    expect(entrance.value.message).toBe("Nenhum produto foi encontrado com o ID: 120");
  });
});
