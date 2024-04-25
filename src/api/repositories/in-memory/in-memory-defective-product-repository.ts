import { DefectiveProduct, Entrance, Product } from "@prisma/client";
import { EDefectiveProductResponse, IDefectiveProduct } from "../../interfaces/IDefectiveProduct";

class InMemoryDefectiveProductRepository implements IDefectiveProduct {
  public readonly defectiveProducts: DefectiveProduct[] = [];
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

  public async getAll(): Promise<DefectiveProduct[]> {
    return this.defectiveProducts;
  }

  public async getById(
    id: number
  ): Promise<DefectiveProduct | EDefectiveProductResponse.DefectiveProductNotFound> {
    const defectiveProduct = this.defectiveProducts.find(
      (defectiveProduct) => defectiveProduct.id === id
    );

    if (!defectiveProduct) {
      return EDefectiveProductResponse.DefectiveProductNotFound;
    }

    return defectiveProduct;
  }

  public async create(
    description: string,
    quantity_products: number,
    id_entrance: number,
    id_store_token: number
  ): Promise<
    | DefectiveProduct
    | EDefectiveProductResponse.NotAuthorized
    | EDefectiveProductResponse.EntranceNotFound
  > {
    const entranceExists = this.entrances.find((entrance) => entrance.id === id_entrance);

    if (!entranceExists) {
      return EDefectiveProductResponse.EntranceNotFound;
    }

    const product = this.products.find((product) => product.id === entranceExists.id_product);

    if (product?.id_store !== id_store_token) {
      return EDefectiveProductResponse.NotAuthorized;
    }

    const defectiveProduct = {
      id: 1,
      description,
      quantity_products,
      id_entrance,
    };

    this.defectiveProducts.push(defectiveProduct);

    return defectiveProduct;
  }

  public async update(
    id: number,
    description: string,
    quantity_products: number,
    id_store_token: number
  ): Promise<
    | DefectiveProduct
    | EDefectiveProductResponse.DefectiveProductNotFound
    | EDefectiveProductResponse.NotAuthorized
  > {
    const defectiveProduct = this.defectiveProducts.find(
      (defectiveProduct) => defectiveProduct.id === id
    );

    if (!defectiveProduct) {
      return EDefectiveProductResponse.DefectiveProductNotFound;
    }

    const entranceExists = this.entrances.find(
      (entrance) => entrance.id === defectiveProduct.id_entrance
    );

    const product = this.products.find((product) => product.id === entranceExists?.id_product);

    if (product?.id_store !== id_store_token) {
      return EDefectiveProductResponse.NotAuthorized;
    }

    defectiveProduct.description = description;
    defectiveProduct.quantity_products = quantity_products;

    return defectiveProduct;
  }

  public async delete(
    id: number,
    id_store_token: number
  ): Promise<
    | DefectiveProduct
    | EDefectiveProductResponse.NotAuthorized
    | EDefectiveProductResponse.DefectiveProductNotFound
  > {
    const defectiveProduct = this.defectiveProducts.find(
      (defectiveProduct) => defectiveProduct.id === id
    );

    if (!defectiveProduct) {
      return EDefectiveProductResponse.DefectiveProductNotFound;
    }

    const entranceExists = this.entrances.find(
      (entrance) => entrance.id === defectiveProduct.id_entrance
    );

    const product = this.products.find((product) => product.id === entranceExists?.id_product);

    if (product?.id_store !== id_store_token) {
      return EDefectiveProductResponse.NotAuthorized;
    }

    this.defectiveProducts.pop();

    return defectiveProduct;
  }
}

export { InMemoryDefectiveProductRepository };
