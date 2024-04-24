import { expect, describe, it, beforeEach } from "vitest";
import { CreateStoreService } from "./create-store-service";
import { InMemoryStoreRepository } from "../../repositories/in-memory/in-memory-store-repository";
import { Failure, Success } from "../../errors/either";
import bcrypt from "bcrypt";

let storeRepository: InMemoryStoreRepository;
let createStoreService: CreateStoreService;

describe("create a store", () => {
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    createStoreService = new CreateStoreService(storeRepository);
  });

  it("should be able to create a store", async () => {
    const store = await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const passwordHashed = store.value.password;

    expect(store).toBeInstanceOf(Success);
    expect(store.value).toEqual({
      id: 1,
      name_store: "mtCompany",
      email: "mtcompany@teste.com",
      password: passwordHashed,
    });
  });

  it("should hashed password", async () => {
    const store = await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const passwordHashed = await bcrypt.compare("102030", store.value.password);

    expect(passwordHashed).toBe(true);
  });

  it("should not be able to create a store if already exists a store with same name", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Já existe uma loja com esse nome: mtCompany");
  });

  it("should not be able to create a store if already exists a store with same email", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await createStoreService.execute(
      "ronaldinho LTDA.",
      "mtcompany@teste.com",
      "102030"
    );

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Esse email já foi cadastrado");
  });

  it("should not be able to create a store if the name store field is a different type of string", async () => {
    const store = await createStoreService.execute(1234, "mtcompany@teste.com", "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O nome da loja deve ser uma string");
  });

  it("should not be able to create a store if the email field is a different type of string", async () => {
    const store = await createStoreService.execute("mtCompany", new Date(), "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O email da loja deve ser uma string");
  });

  it("should not be able to create a store if the password field is a different type of string", async () => {
    const store = await createStoreService.execute("mtCompany", "mtcompany@teste.com", {});

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("A senha da loja deve ser uma string");
  });

  it("should not be able to create a store if the email is not valid address", async () => {
    const store = await createStoreService.execute("mtCompany", "mtcompany", "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Endereço de email inválido");
  });

  it("should not be able to create a store if the password field is empty", async () => {
    const store = await createStoreService.execute("mtCompany", "mtcompany@teste.com");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Informe a senha da loja");
  });

  it("should not be able to create a store if the name store field is empty", async () => {
    const store = await createStoreService.execute();

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Informe o nome da loja");
  });
});
