import { Store } from "@prisma/client";

enum EStoreResponse {
  StoreNotFound,
  NameStoreExists,
  EmailExists,
  NotAuthorized,
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
    id_store_token: number
  ): Promise<
    | Store
    | EStoreResponse.StoreNotFound
    | EStoreResponse.NameStoreExists
    | EStoreResponse.NotAuthorized
  >;
  delete(
    id: number,
    id_store_token: number
  ): Promise<Store | EStoreResponse.StoreNotFound | EStoreResponse.NotAuthorized>;
  login(email: string): Promise<Store | EStoreResponse.StoreNotFound>;
}

export { IStore, EStoreResponse };
