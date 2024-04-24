import { CreateExitService } from "./create-exit-service";
import { GetAllExitsService } from "./get-all-exits-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryExitRepository } from "../../repositories/in-memory/in-memory-exit-repository";

let exitRepository: InMemoryExitRepository;
let createExitService: CreateExitService;
let getAllExitsService: GetAllExitsService;

describe("get all exits", () => {
  beforeEach(() => {
    exitRepository = new InMemoryExitRepository();
    createExitService = new CreateExitService(exitRepository);
    getAllExitsService = new GetAllExitsService(exitRepository);
  });

  it("should be able to get all exits", async () => {
    await createExitService.execute("mT fornecedor", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createExitService.execute("chapolin LTDA.", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createExitService.execute("camisetas L", 100, 1050, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const exits = await getAllExitsService.execute();

    expect(exits.length).toBeGreaterThanOrEqual(3);
  });
});
