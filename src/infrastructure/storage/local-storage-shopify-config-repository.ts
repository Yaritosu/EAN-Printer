import { type ShopifyConfigRepository } from "@/application/shopify/shopify-config-repository";
import { type ShopifyConfig } from "@/domain/shopify/entities/shopify-config";

const storageKey = "ean-printer.shopify-config.v1";

export class LocalStorageShopifyConfigRepository implements ShopifyConfigRepository {
  constructor(private readonly storage: Storage) {}

  async load(): Promise<ShopifyConfig | null> {
    const raw = this.storage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as ShopifyConfig;
  }

  async save(config: ShopifyConfig): Promise<ShopifyConfig> {
    this.storage.setItem(storageKey, JSON.stringify(config));
    return config;
  }
}
