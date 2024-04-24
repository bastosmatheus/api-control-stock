import { CreateDevolutionService } from "./create-devolution-service";
import { GetAllDevolutionsService } from "./get-all-devolutions-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDevolutionRepository } from "../../repositories/in-memory/in-memory-devolution-repository";

let devolutionRepository: InMemoryDevolutionRepository;
let createDevolutionService: CreateDevolutionService;
let getAllDevolutionsService: GetAllDevolutionsService;

describe("get all devolutions", () => {
  beforeEach(() => {
    devolutionRepository = new InMemoryDevolutionRepository();
    createDevolutionService = new CreateDevolutionService(devolutionRepository);
    getAllDevolutionsService = new GetAllDevolutionsService(devolutionRepository);
  });

  it("should be able to get all devolutions", async () => {
    await createDevolutionService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createDevolutionService.execute("Cor errada", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createDevolutionService.execute("Camiseta está desfiando", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const devolutions = await getAllDevolutionsService.execute();

    expect(devolutions.length).toBeGreaterThanOrEqual(3);
  });
});
