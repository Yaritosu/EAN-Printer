import { type ShopifyConfigRepository } from "./shopify-config-repository";

export const loadShopifyConfig = async (repository: ShopifyConfigRepository) => repository.load();
