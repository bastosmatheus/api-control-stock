import { CreateEntranceService } from "./create-entrance-service";
import { GetAllEntrancesService } from "./get-all-entrances-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryEntranceRepository } from "../../repositories/in-memory/in-memory-entrance-repository";

let entranceRepository: InMemoryEntranceRepository;
let createEntranceService: CreateEntranceService;
let getAllEntrancesService: GetAllEntrancesService;

describe("get all entrances", () => {
  beforeEach(() => {
    entranceRepository = new InMemoryEntranceRepository();
    createEntranceService = new CreateEntranceService(entranceRepository);
    getAllEntrancesService = new GetAllEntrancesService(entranceRepository);
  });

  it("should be able to get all entrances", async () => {
    await createEntranceService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createEntranceService.execute("chapolin LTDA.", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createEntranceService.execute("camisetas L", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const entrances = await getAllEntrancesService.execute();

    expect(entrances.length).toBeGreaterThanOrEqual(3);
  });
});
