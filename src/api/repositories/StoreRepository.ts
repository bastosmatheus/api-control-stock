import { Store } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { EStoreResponse, IStore } from "../interfaces/IStore";

class StoreRepository implements IStore {
  public async getAll(): Promise<Store[]> {
    const stores = await prismaClient.store.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        product: true,
      },
    });

    return stores;
  }

  public async getById(id: number): Promise<Store | EStoreResponse.StoreNotFound> {
    const store = await prismaClient.store.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
      },
    });

    if (store === null) {
      return EStoreResponse.StoreNotFound;
    }

    return store;
  }

  public async create(
    name_store: string,
    email: string,
    password: string
  ): Promise<Store | EStoreResponse.NameStoreExists | EStoreResponse.EmailExists> {
    const nameStoreExists = await prismaClient.store.findUnique({
      where: {
        name_store,
      },
    });

    if (nameStoreExists) {
      return EStoreResponse.NameStoreExists;
    }

    const emailExists = await prismaClient.store.findUnique({
      where: {
        email,
      },
    });

    if (emailExists) {
      return EStoreResponse.EmailExists;
    }

    const store = await prismaClient.store.create({
      data: {
        name_store,
        email,
        password,
      },
      include: {
        product: true,
      },
    });

    return store;
  }

  public async update(
    id: number,
    name_store: string,
    id_store_token: number
  ): Promise<
    | Store
    | EStoreResponse.StoreNotFound
    | EStoreResponse.NameStoreExists
    | EStoreResponse.NotAuthorized
  > {
    if (id !== id_store_token) {
      return EStoreResponse.NotAuthorized;
    }

    const store = await prismaClient.store.findUnique({
      where: {
        id,
      },
    });

    if (store === null) {
      return EStoreResponse.StoreNotFound;
    }

    const nameStore = await prismaClient.store.findUnique({
      where: {
        name_store,
      },
    });

    if (nameStore && nameStore.id !== id) {
      return EStoreResponse.NameStoreExists;
    }

    const storeUpdated = await prismaClient.store.update({
      where: {
        id,
      },
      data: {
        name_store,
      },
    });

    return storeUpdated;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<Store | EStoreResponse.StoreNotFound | EStoreResponse.NotAuthorized> {
    if (id !== id_store_token) {
      return EStoreResponse.NotAuthorized;
    }

    const store = await prismaClient.store.findUnique({
      where: {
        id,
      },
    });

    if (store === null) {
      return EStoreResponse.StoreNotFound;
    }

    const storeDeleted = await prismaClient.store.delete({
      where: {
        id,
      },
    });

    return storeDeleted;
  }

  public async login(email: string): Promise<Store | EStoreResponse.StoreNotFound> {
    const store = await prismaClient.store.findUnique({
      where: {
        email,
      },
    });

    if (store === null) {
      return EStoreResponse.StoreNotFound;
    }

    return store;
  }
}

export { StoreRepository };
