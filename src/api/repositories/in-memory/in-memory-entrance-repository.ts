import { Entrance, Product } from "@prisma/client";
import { EEntranceResponse, IEntrance } from "../../interfaces/IEntrance";

class InMemoryEntranceRepository implements IEntrance {
  public readonly entrances: Entrance[] = [];
  public readonly products: Product[] = [
    {
      id: 1,
      id_store: 1,
      name_product: "Camiseta do Corinthians",
      price_product: 15.0,
      quantity_product_stock: 100,
    },
  ];

  public async getAll(): Promise<Entrance[]> {
    return this.entrances;
  }

  public async getById(id: number): Promise<Entrance | EEntranceResponse.EntranceNotFound> {
    const entrance = this.entrances.find((entrance) => entrance.id === id);

    if (!entrance) {
      return EEntranceResponse.EntranceNotFound;
    }

    return entrance;
  }

  public async create(
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<Entrance | EEntranceResponse.NotAuthorized | EEntranceResponse.ProductNotFound> {
    const productExists = this.products.find((product) => product.id === id_product);

    if (!productExists) {
      return EEntranceResponse.ProductNotFound;
    }

    if (productExists.id_store !== id_store_token) {
      return EEntranceResponse.NotAuthorized;
    }

    productExists.quantity_product_stock +=
      productExists.quantity_product_stock + quantity_products;

    const entrance = {
      id: 1,
      supplier,
      price_total,
      quantity_products,
      entrance_date: new Date("2020-02-10"),
      id_product,
    };

    this.entrances.push(entrance);

    return entrance;
  }

  public async update(
    id: number,
    supplier: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<
    | Entrance
    | EEntranceResponse.ProductNotFound
    | EEntranceResponse.NotAuthorized
    | EEntranceResponse.EntranceNotFound
  > {
    const entrance = this.entrances.find((entrance) => entrance.id === id);

    if (!entrance) {
      return EEntranceResponse.EntranceNotFound;
    }

    const productExists = this.products.find((product) => product.id === id_product);

    if (!productExists) {
      return EEntranceResponse.ProductNotFound;
    }

    if (productExists.id_store !== id_store_token) {
      return EEntranceResponse.NotAuthorized;
    }

    entrance.supplier = supplier;
    entrance.quantity_products = quantity_products;
    entrance.price_total = price_total;
    entrance.id_product = id_product;

    return entrance;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<Entrance | EEntranceResponse.NotAuthorized | EEntranceResponse.EntranceNotFound> {
    const entrance = this.entrances.find((entrance) => entrance.id === id);

    if (!entrance) {
      return EEntranceResponse.EntranceNotFound;
    }

    const product = this.products.find((product) => product.id === entrance.id_product);

    if (product?.id_store !== id_store_token) {
      return EEntranceResponse.NotAuthorized;
    }

    this.entrances.pop();

    return entrance;
  }
}

export { InMemoryEntranceRepository };
