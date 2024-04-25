import { Exit, Product } from "@prisma/client";
import { EExitResponse, IExit } from "../../interfaces/IExit";

class InMemoryExitRepository implements IExit {
  public readonly exits: Exit[] = [];
  public readonly products: Product[] = [
    {
      id: 1,
      id_store: 1,
      name_product: "Camiseta do Corinthians",
      price_product: 15.0,
      quantity_product_stock: 100,
    },
  ];

  public async getAll(): Promise<Exit[]> {
    return this.exits;
  }

  public async getById(id: number): Promise<EExitResponse.ExitNotFound | Exit> {
    const exit = this.exits.find((exit) => exit.id === id);

    if (!exit) {
      return EExitResponse.ExitNotFound;
    }

    return exit;
  }

  public async create(
    description: string,
    quantity_products: number,
    price_total: number,
    id_product: number,
    id_store_token: number
  ): Promise<
    EExitResponse.ProductNotFound | EExitResponse.NotAuthorized | EExitResponse.NoStock | Exit
  > {
    const productExists = this.products.find((product) => product.id === id_product);

    if (!productExists) {
      return EExitResponse.ProductNotFound;
    }

    if (productExists.id_store !== id_store_token) {
      return EExitResponse.NotAuthorized;
    }

    if (productExists.quantity_product_stock - quantity_products < 0) {
      return EExitResponse.NoStock;
    }

    const exit = {
      id: 1,
      description,
      price_total,
      quantity_products,
      exit_date: new Date("2020-02-10"),
      id_product,
    };

    this.exits.push(exit);

    return exit;
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    price_total: number,
    id_store_token: number
  ): Promise<
    EExitResponse.ExitNotFound | EExitResponse.NotAuthorized | EExitResponse.NoStock | Exit
  > {
    const exit = this.exits.find((exit) => exit.id === id);

    if (!exit) {
      return EExitResponse.ExitNotFound;
    }

    const productExists = this.products.find((product) => product.id === exit.id_product);

    if (productExists?.id_store !== id_store_token) {
      return EExitResponse.NotAuthorized;
    }

    if (productExists.quantity_product_stock - quantity_products < 0) {
      return EExitResponse.NoStock;
    }

    exit.description = description;
    exit.quantity_products = quantity_products;
    exit.price_total = price_total;

    return exit;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<EExitResponse.ExitNotFound | EExitResponse.NotAuthorized | Exit> {
    const exit = this.exits.find((exit) => exit.id === id);

    if (!exit) {
      return EExitResponse.ExitNotFound;
    }

    const product = this.products.find((product) => product.id === exit.id_product);

    if (product?.id_store !== id_store_token) {
      return EExitResponse.NotAuthorized;
    }

    this.exits.pop();

    return exit;
  }
}

export { InMemoryExitRepository };
