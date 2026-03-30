import { createShopifyConfig, type ShopifyConfigInput } from "@/domain/shopify/entities/shopify-config";

import { type ShopifyConfigRepository } from "./shopify-config-repository";

export const saveShopifyConfig = async (
  repository: ShopifyConfigRepository,
  input: ShopifyConfigInput
) => {
  const config = createShopifyConfig(input);
  return repository.save(config);
};
