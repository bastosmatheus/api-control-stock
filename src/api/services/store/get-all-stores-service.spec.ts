import { expect, describe, it, beforeEach } from "vitest";
import { CreateStoreService } from "./create-store-service";
import { InMemoryStoreRepository } from "../../repositories/in-memory/in-memory-store-repository";
import { GetAllStoresService } from "./get-all-stores-service";

let storeRepository: InMemoryStoreRepository;
let createStoreService: CreateStoreService;
let getAllStoresService: GetAllStoresService;

describe("get all stores", () => {
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    createStoreService = new CreateStoreService(storeRepository);
    getAllStoresService = new GetAllStoresService(storeRepository);
  });

  it("should be able to get all stores", async () => {
    await createStoreService.execute("mtCompany", "mtcompany@teste.com", "102030");
    await createStoreService.execute("ronaldinho", "ronaldinho@teste.com", "102030");
    await createStoreService.execute("jett", "jett@teste.com", "102030");

    const stores = await getAllStoresService.execute();

    expect(stores.length).toBeGreaterThanOrEqual(3);
  });
});
