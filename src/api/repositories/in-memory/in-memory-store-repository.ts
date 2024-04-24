import { Store } from "@prisma/client";
import { EStoreResponse, IStore } from "../../interfaces/IStore";

class InMemoryStoreRepository implements IStore {
  public readonly stores: Store[] = [];

  public async getAll(): Promise<Store[]> {
    return this.stores;
  }

  public async getById(id: number): Promise<EStoreResponse.StoreNotFound | Store> {
    const store = this.stores.find((store) => store.id === id);

    if (!store) {
      return EStoreResponse.StoreNotFound;
    }

    return store;
  }

  public async create(
    name_store: string,
    email: string,
    password: string
  ): Promise<Store | EStoreResponse.NameStoreExists | EStoreResponse.EmailExists> {
    const nameStoreExists = this.stores.find((store) => store.name_store === name_store);

    if (nameStoreExists) {
      return EStoreResponse.NameStoreExists;
    }

    const emailExists = this.stores.find((store) => store.email === email);

    if (emailExists) {
      return EStoreResponse.EmailExists;
    }

    const store = {
      id: 1,
      name_store,
      email,
      password,
    };

    this.stores.push(store);

    return store;
  }

  public async update(
    id: number,
    name_store: string,
    id_store_token: number
  ): Promise<
    | Store
    | EStoreResponse.NotAuthorized
    | EStoreResponse.StoreNotFound
    | EStoreResponse.NameStoreExists
  > {
    if (id !== id_store_token) {
      return EStoreResponse.NotAuthorized;
    }

    const store = this.stores.find((store) => store.id === id);

    if (!store) {
      return EStoreResponse.StoreNotFound;
    }

    const nameStoreExists = this.stores.find((store) => store.name_store === name_store);

    if (nameStoreExists && nameStoreExists.id !== id) {
      return EStoreResponse.StoreNotFound;
    }

    store.name_store = name_store;

    return store;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<EStoreResponse.StoreNotFound | EStoreResponse.NotAuthorized | Store> {
    if (id !== id_store_token) {
      return EStoreResponse.NotAuthorized;
    }

    const store = this.stores.find((store) => store.id === id);

    if (!store) {
      return EStoreResponse.StoreNotFound;
    }

    this.stores.pop();

    return store;
  }

  public async login(email: string): Promise<Store | EStoreResponse.StoreNotFound> {
    const store = this.stores.find((store) => store.email === email);

    if (!store) {
      return EStoreResponse.StoreNotFound;
    }

    return store;
  }
}

export { InMemoryStoreRepository };
