import { Store } from "@prisma/client";
import { StoreRepository } from "../../repositories/StoreRepository";

class GetAllStoresService {
  constructor(private storeRepository: StoreRepository) {}

  public async execute(): Promise<Store[]> {
    const stores = this.storeRepository.getAll();

    return stores;
  }
}

export { GetAllStoresService };
