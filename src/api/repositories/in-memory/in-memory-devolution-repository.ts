import { Devolution, Entrance, Product } from "@prisma/client";
import { EDevolutionResponse, IDevolution } from "../../interfaces/IDevolution";

class InMemoryDevolutionRepository implements IDevolution {
  public readonly devolutions: Devolution[] = [];
  public readonly entrances: Entrance[] = [
    {
      id: 1,
      entrance_date: new Date(),
      price_total: 15.0,
      supplier: "mT fornecedor",
      quantity_products: 1,
      id_product: 1,
    },
  ];
  public readonly products: Product[] = [
    {
      id: 1,
      id_store: 1,
      name_product: "Camiseta do Corinthians",
      price_product: 15.0,
      quantity_product_stock: 100,
    },
  ];

  public async getAll(): Promise<Devolution[]> {
    return this.devolutions;
  }

  public async getById(id: number): Promise<Devolution | EDevolutionResponse.DevolutionNotFound> {
    const devolution = this.devolutions.find((devolution) => devolution.id === id);

    if (!devolution) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    return devolution;
  }

  public async create(
    description: string,
    quantity_products: number,
    id_entrance: number,
    id_store_token: number
  ): Promise<
    Devolution | EDevolutionResponse.NotAuthorized | EDevolutionResponse.EntranceNotFound
  > {
    const entranceExists = this.entrances.find((entrance) => entrance.id === id_entrance);

    if (!entranceExists) {
      return EDevolutionResponse.EntranceNotFound;
    }

    const product = this.products.find((product) => product.id === entranceExists.id_product);

    if (product?.id_store !== id_store_token) {
      return EDevolutionResponse.NotAuthorized;
    }

    const devolution = {
      id: 1,
      description,
      quantity_products,
      devolution_date: new Date("2020-02-10"),
      id_entrance,
    };

    this.devolutions.push(devolution);

    return devolution;
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_entrance: number,
    id_store_token: number
  ): Promise<
    | Devolution
    | EDevolutionResponse.NotAuthorized
    | EDevolutionResponse.DevolutionNotFound
    | EDevolutionResponse.EntranceNotFound
  > {
    const devolution = this.devolutions.find((devolution) => devolution.id === id);

    if (!devolution) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    const entranceExists = this.entrances.find((entrance) => entrance.id === id_entrance);

    if (!entranceExists) {
      return EDevolutionResponse.EntranceNotFound;
    }

    const product = this.products.find((product) => product.id === entranceExists.id_product);

    if (product?.id_store !== id_store_token) {
      return EDevolutionResponse.NotAuthorized;
    }

    devolution.description = description;
    devolution.quantity_products = quantity_products;
    devolution.id_entrance = id_entrance;

    return devolution;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<
    Devolution | EDevolutionResponse.NotAuthorized | EDevolutionResponse.DevolutionNotFound
  > {
    const devolution = this.devolutions.find((devolution) => devolution.id === id);

    if (!devolution) {
      return EDevolutionResponse.DevolutionNotFound;
    }

    const entranceExists = this.entrances.find(
      (entrance) => entrance.id === devolution.id_entrance
    );

    const product = this.products.find((product) => product.id === entranceExists?.id_product);

    if (product?.id_store !== id_store_token) {
      return EDevolutionResponse.NotAuthorized;
    }

    this.devolutions.pop();

    return devolution;
  }
}

export { InMemoryDevolutionRepository };
