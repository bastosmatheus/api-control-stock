import { expect, describe, it, beforeEach } from "vitest";
import { CreateProductService } from "./create-product-service";
import { InMemoryProductRepository } from "../../repositories/in-memory/in-memory-product-repository";
import { GetAllProductsService } from "./get-all-products-service";

let productRepository: InMemoryProductRepository;
let createProductService: CreateProductService;
let getAllProductsService: GetAllProductsService;

describe("get all products", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    createProductService = new CreateProductService(productRepository);
    getAllProductsService = new GetAllProductsService(productRepository);
  });

  it("should be able get all products", async () => {
    await createProductService.execute("Camiseta do Corinthians", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createProductService.execute("Camiseta do Brasil", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });
    await createProductService.execute("Camiseta do Sport", 100, 1, {
      id: 1,
      name_store: "mtCompany",
    });

    const products = await getAllProductsService.execute();

    expect(products.length).toBeGreaterThanOrEqual(3);
  });
});
