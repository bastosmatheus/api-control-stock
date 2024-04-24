import { Devolution } from "@prisma/client";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";

class GetAllDevolutionsService {
  constructor(private devolutionRepository: DevolutionRepository) {}

  public async execute(): Promise<Devolution[]> {
    const devolutions = await this.devolutionRepository.getAll();

    return devolutions;
  }
}

export { GetAllDevolutionsService };
