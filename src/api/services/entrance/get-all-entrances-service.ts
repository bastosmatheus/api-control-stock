import { Entrance } from "@prisma/client";
import { EntranceRepository } from "../../repositories/EntranceRepository";

class GetAllEntrancesService {
  constructor(private entranceRepository: EntranceRepository) {}

  public async execute(): Promise<Entrance[]> {
    const entrances = await this.entranceRepository.getAll();

    return entrances;
  }
}

export { GetAllEntrancesService };
