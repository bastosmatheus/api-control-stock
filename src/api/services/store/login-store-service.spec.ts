import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStoreRepository } from "../../repositories/in-memory/in-memory-store-repository";
import { CreateStoreService } from "./create-store-service";
import { LoginStoreService } from "./login-store-service";
import { Failure, Success } from "../../errors/either";

let storeRepository: InMemoryStoreRepository;
let createStoreService: CreateStoreService;
let loginStoreService: LoginStoreService;

describe("login", () => {
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    createStoreService = new CreateStoreService(storeRepository);
    loginStoreService = new LoginStoreService(storeRepository);
  });

  it("should be able to login and received a token", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mtcompany@teste.com", "102030");

    expect(store).toBeInstanceOf(Success);
    expect(store.value).toBeTypeOf("string");
  });

  it("should not be able to login if the credentials are wrong (email)", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mt@teste.com", "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Email inválido");
  });

  it("should not be able to login if the credentials are wrong (password)", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mtcompany@teste.com", "1111111111111111111");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Senha inválida");
  });

  it("should not be able to login if the password is less then 5 characters", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mtcompany@teste.com", "2");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("A senha deve ter no mínimo 5 caracteres");
  });

  it("should not be able to login if the email is not valid address", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mtcompany", "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Digite um email válido");
  });

  it("should not be able to login if the password field is empty", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mtcompany@teste.com");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Informe a senha");
  });

  it("should not be able to login if the password email is empty", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute();

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("Informe o email");
  });

  it("should not be able to login if the password field is a different type of string", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute("mtcompany@teste.com", new Date());

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("A senha deve ser uma string");
  });

  it("should not be able to login if the email field is a different type of string", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");

    const store = await loginStoreService.execute([], "102030");

    expect(store).toBeInstanceOf(Failure);
    expect(store.value).toHaveProperty("message");
    expect(store.value.message).toBe("O email deve ser uma string");
  });
});
