import { expect, describe, it, beforeEach } from "vitest";
import { CreateStoreService } from "./create-store-service";
import { InMemoryStoreRepository } from "../../repositories/in-memory/in-memory-store-repository";
import { Failure, Success } from "../../errors/either";
import { UpdateStoreService } from "./update-store-service";

let storeRepository: InMemoryStoreRepository;
let createStoreService: CreateStoreService;
let updateStoreService: UpdateStoreService;

describe("delete a store", () => {
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    createStoreService = new CreateStoreService(storeRepository);
    updateStoreService = new UpdateStoreService(storeRepository);
  });

  it("should be able to update a store", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute(1, "SCCP", {
      id: 1,
      name_store: "mtCompany",
    });

    const passwordHashed = store.value.password;

    expect(store).toBeInstanceOf(Success);
    expect(store.value).toEqual({
      id: 1,
      name_store: "SCCP",
      email: "mtcompany@teste.com",
      password: passwordHashed,
    });
  });

  it("should not be able to delete a store if the id store token is different from the id", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute(1, "SCCP", {
      id: 10,
      name_store: "mtCompany",
    });

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Você não tem permissão para atualizar essa loja");
  });

  it("should not be able to update a store if the id field is empty", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute();

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to update a store if the name store field is empty", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute(1);

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Informe o nome da loja");
  });

  it("should not be able to update a store if the id field is different type of number", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute("1", "SCCP", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to update a store if the name store field is different type of string", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute(
      1,
      {},
      {
        id: 1,
        name_store: "mtCompany",
      }
    );

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O nome da loja deve ser uma string");
  });

  it("should not be able to update a store if the id field is less then 1", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await updateStoreService.execute(-1, "SCCP", {
      id: 1,
      name_store: "mtCompany",
    });

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O ID não pode ser menor que 1");
  });
});
