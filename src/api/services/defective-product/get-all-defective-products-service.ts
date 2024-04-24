import { DefectiveProduct } from "@prisma/client";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";

class GetAllDefectiveProductsService {
  constructor(private defectiveProductRepository: DefectiveProductRepository) {}

  public async execute(): Promise<DefectiveProduct[]> {
    const defectiveProducts = await this.defectiveProductRepository.getAll();

    return defectiveProducts;
  }
}

export { GetAllDefectiveProductsService };
