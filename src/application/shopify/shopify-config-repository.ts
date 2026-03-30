import { type ShopifyConfig } from "@/domain/shopify/entities/shopify-config";

export interface ShopifyConfigRepository {
  load(): Promise<ShopifyConfig | null>;
  save(config: ShopifyConfig): Promise<ShopifyConfig>;
}
