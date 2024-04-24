import { CreateDefectiveProductService } from "./create-defective-product-service";
import { GetAllDefectiveProductsService } from "./get-all-defective-products-service";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryDefectiveProductRepository } from "../../repositories/in-memory/in-memory-defective-product-repository";

let defectiveProductRepository: InMemoryDefectiveProductRepository;
let createDefectiveProductService: CreateDefectiveProductService;
let getAllDefectiveProductsService: GetAllDefectiveProductsService;

describe("get all defective products", () => {
  beforeEach(() => {
    defectiveProductRepository = new InMemoryDefectiveProductRepository();
    createDefectiveProductService = new CreateDefectiveProductService(defectiveProductRepository);
    getAllDefectiveProductsService = new GetAllDefectiveProductsService(defectiveProductRepository);
  });

  it("should be able to get all defective products", async () => {
    await createDefectiveProductService.execute("Produto veio quebrado", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createDefectiveProductService.execute("Cor errada", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createDefectiveProductService.execute("Camiseta está desfiando", 1, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const defectiveProducts = await getAllDefectiveProductsService.execute();

    expect(defectiveProducts.length).toBeGreaterThanOrEqual(3);
  });
});
