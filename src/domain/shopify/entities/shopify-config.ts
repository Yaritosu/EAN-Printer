export type ShopifyConfigStatus = "not_configured" | "configured";

export type ShopifyConfig = {
  shopDomain: string;
  adminApiToken: string;
  apiVersion: string;
  status: ShopifyConfigStatus;
  updatedAt: string;
};

export type ShopifyConfigInput = {
  shopDomain: string;
  adminApiToken: string;
  apiVersion: string;
};

const normalize = (value: string): string => value.trim();

export const createShopifyConfig = (input: ShopifyConfigInput): ShopifyConfig => {
  const shopDomain = normalize(input.shopDomain);
  const adminApiToken = normalize(input.adminApiToken);
  const apiVersion = normalize(input.apiVersion);

  if (!shopDomain) {
    throw new Error("Shop-Domain ist erforderlich.");
  }

  if (!adminApiToken) {
    throw new Error("Admin API Token ist erforderlich.");
  }

  if (!apiVersion) {
    throw new Error("API-Version ist erforderlich.");
  }

  return {
    shopDomain,
    adminApiToken,
    apiVersion,
    status: "configured",
    updatedAt: new Date().toISOString()
  };
};
