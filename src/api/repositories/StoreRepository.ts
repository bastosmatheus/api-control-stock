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
    password: string
  ): Promise<Store | EStoreResponse.StoreNotFound | EStoreResponse.NameStoreExists> {
    const storeExists = await prismaClient.store.findUnique({
      where: {
        id,
      },
    });

    if (!storeExists) {
      return EStoreResponse.StoreNotFound;
    }

    const nameStoreExists = await prismaClient.store.findUnique({
      where: {
        name_store,
      },
    });

    if (nameStoreExists && nameStoreExists.id !== id) {
      return EStoreResponse.NameStoreExists;
    }

    const store = await prismaClient.store.update({
      where: {
        id,
      },
      data: {
        name_store,
        password,
      },
    });

    return store;
  }

  public async delete(id: number): Promise<Store | EStoreResponse.StoreNotFound> {
    const storeExists = await prismaClient.store.findUnique({
      where: {
        id,
      },
    });

    if (!storeExists) {
      return EStoreResponse.StoreNotFound;
    }

    const store = await prismaClient.store.delete({
      where: {
        id,
      },
    });

    return store;
  }
}

export { StoreRepository };
