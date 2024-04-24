import { expect, describe, it, beforeEach } from "vitest";
import { CreateStoreService } from "./create-store-service";
import { InMemoryStoreRepository } from "../../repositories/in-memory/in-memory-store-repository";
import { Failure, Success } from "../../errors/either";
import { GetStoreByIdService } from "./get-store-by-id-service";

let storeRepository: InMemoryStoreRepository;
let createStoreService: CreateStoreService;
let getStoreByIdService: GetStoreByIdService;

describe("get one store by id", () => {
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    createStoreService = new CreateStoreService(storeRepository);
    getStoreByIdService = new GetStoreByIdService(storeRepository);
  });

  it("should be able to get a store", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await getStoreByIdService.execute(1);

    const passwordHashed = store.value.password;

    expect(store).toBeInstanceOf(Success);
    expect(store.value).toEqual({
      id: 1,
      name_store: "mtCompany",
      email: "mtcompany@teste.com",
      password: passwordHashed,
    });
  });

  it("should not be able to get a store if the id field is empty", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await getStoreByIdService.execute();

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O ID é obrigatório");
  });

  it("should not be able to get a store if the id field is different type of number", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await getStoreByIdService.execute("1");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O ID deve ser um número");
  });

  it("should not be able to get a store if the id field is less then 1", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await getStoreByIdService.execute(-1);

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O ID não pode ser menor que 1");
  });

  it("should not be able to get a store if the id field is less then 1", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await getStoreByIdService.execute(10);

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Nenhuma loja foi encontrada com o ID: 10");
  });
});
