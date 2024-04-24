import { Exit } from "@prisma/client";
import { ExitRepository } from "../../repositories/ExitRepository";

class GetAllExitsService {
  constructor(private exitRepository: ExitRepository) {}

  public async execute(): Promise<Exit[]> {
    const exits = await this.exitRepository.getAll();

    return exits;
  }
}

export { GetAllExitsService };
