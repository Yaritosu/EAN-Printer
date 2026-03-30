import { loadShopifyConfig } from "@/application/shopify/load-shopify-config";
import { saveShopifyConfig } from "@/application/shopify/save-shopify-config";
import { LocalStorageShopifyConfigRepository } from "@/infrastructure/storage/local-storage-shopify-config-repository";

describe("LocalStorageShopifyConfigRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads a prepared shopify configuration", async () => {
    const repository = new LocalStorageShopifyConfigRepository(localStorage);

    await saveShopifyConfig(repository, {
      shopDomain: "elvent-3.myshopify.com",
      adminApiToken: "shpat_test_token",
      apiVersion: "2026-01"
    });

    const config = await loadShopifyConfig(repository);

    expect(config).not.toBeNull();
    expect(config?.shopDomain).toBe("elvent-3.myshopify.com");
    expect(config?.status).toBe("configured");
  });
});
