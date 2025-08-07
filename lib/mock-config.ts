// Configuration for mock mode
export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

// Mock Plaid configuration
export const MOCK_PLAID_CONFIG = {
  CLIENT_ID: "mock_client_id",
  SECRET: "mock_secret",
  PUBLIC_TOKEN: "mock_public_token",
  ACCESS_TOKEN: "mock_access_token",
};

// Mock Dwolla configuration
export const MOCK_DWOLLA_CONFIG = {
  KEY: "mock_key",
  SECRET: "mock_secret",
  CUSTOMER_ID: "mock_customer_id",
  FUNDING_SOURCE: "mock_funding_source",
};

// Helper to check if we're in mock mode
export const isMockMode = () => {
  return (
    MOCK_MODE ||
    !process.env.PLAID_CLIENT_ID ||
    !process.env.DWOLLA_KEY ||
    process.env.PLAID_CLIENT_ID === "your-plaid-client-id" ||
    process.env.DWOLLA_KEY === "your-dwolla-key"
  );
};
