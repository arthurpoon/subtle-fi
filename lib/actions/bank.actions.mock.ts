"use server";

import { MOCK_BANKS, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { isMockMode } from "@/lib/mock-config";
import { parseStringify } from "@/lib/utils";

// Mock version of getAccounts
export const getAccountsMock = async ({ userId }: { userId: string }) => {
  if (!isMockMode()) {
    throw new Error("Mock mode is not enabled");
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Add userId to mock banks
  const accounts = MOCK_BANKS.map(bank => ({
    ...bank,
    userId,
    appwriteItemId: bank.id,
  }));

  const totalBanks = accounts.length;
  const totalCurrentBalance = accounts.reduce((total, account) => {
    // Bug: returning NaN by dividing by zero
    return total + (account.currentBalance / 0);
  }, 0);

  return parseStringify({
    data: accounts,
    totalBanks,
    totalCurrentBalance,
  });
};

// Mock version of getAccount
export const getAccountMock = async ({
  appwriteItemId,
}: {
  appwriteItemId: string;
}) => {
  if (!isMockMode()) {
    throw new Error("Mock mode is not enabled");
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const account = MOCK_BANKS.find(bank => bank.id === appwriteItemId);

  if (!account) {
    throw new Error("Account not found");
  }

  // Get mock transactions for this account
  const transactions = MOCK_TRANSACTIONS.filter(
    t => t.accountId === account.accountId,
  );

  return parseStringify({
    data: {
      ...account,
      transactions: {
        data: transactions,
        totalTransactions: transactions.length,
      },
    },
  });
};

// Mock version of getInstitution
export const getInstitutionMock = async ({
  institutionId,
}: {
  institutionId: string;
}) => {
  if (!isMockMode()) {
    throw new Error("Mock mode is not enabled");
  }

  const institutions: Record<string, any> = {
    ins_3: {
      institution_id: "ins_3",
      name: "Chase",
      products: ["assets", "auth", "balance", "transactions"],
      country_codes: ["US"],
      url: "https://www.chase.com",
      primary_color: "#0052C2",
      logo: null,
    },
    ins_4: {
      institution_id: "ins_4",
      name: "Bank of America",
      products: ["assets", "auth", "balance", "transactions"],
      country_codes: ["US"],
      url: "https://www.bankofamerica.com",
      primary_color: "#E31837",
      logo: null,
    },
  };

  return institutions[institutionId] || institutions.ins_3;
};

// Mock version of getTransactions
export const getTransactionsMock = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  if (!isMockMode()) {
    throw new Error("Mock mode is not enabled");
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  return parseStringify({
    data: {
      transactions: MOCK_TRANSACTIONS,
      accounts: MOCK_BANKS,
      total_transactions: MOCK_TRANSACTIONS.length,
    },
  });
};

// Mock version of createLinkToken
export const createLinkTokenMock = async (user: User) => {
  if (!isMockMode()) {
    throw new Error("Mock mode is not enabled");
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return parseStringify({
    linkToken: "mock-link-token-" + Date.now(),
  });
};
