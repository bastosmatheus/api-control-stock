import { Store } from "@prisma/client";

enum EStoreResponse {
  StoreNotFound,
  NameStoreExists,
  EmailExists,
}

interface IStore {
  getAll(): Promise<Store[]>;
  getById(id: number): Promise<Store | EStoreResponse.StoreNotFound>;
  create(
    name_store: string,
    email: string,
    password: string
  ): Promise<Store | EStoreResponse.NameStoreExists | EStoreResponse.EmailExists>;
  update(
    id: number,
    name_store: string,
    password: string
  ): Promise<Store | EStoreResponse.StoreNotFound | EStoreResponse.NameStoreExists>;
  delete(id: number): Promise<Store | EStoreResponse.StoreNotFound>;
}

export { IStore, EStoreResponse };
