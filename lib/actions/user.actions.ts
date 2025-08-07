"use server";

import {
  addFundingSource,
  createDwollaCustomer,
} from "@/lib/actions/dwolla.actions";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { plaidClient } from "@/lib/plaid";
import {
  encryptId,
  extractCustomerIdFromUrl,
  parseStringify,
} from "@/lib/utils";
import { isMockMode } from "@/lib/mock-config";
import { MOCK_BANKS, MOCK_USER } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: UserInfoProps) => {
  try {
    // In mock mode, return mock user
    if (isMockMode()) {
      return parseStringify({ ...MOCK_USER, userId, $id: userId });
    }

    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])],
    );

    if (!user.documents || user.documents.length === 0) {
      console.error("No user found with userId:", userId);
      return null;
    }

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

export const signInUser = async ({ email, password }: SignInProps) => {
  try {
    // In mock mode, simulate sign in
    if (isMockMode()) {
      // Check if it's a valid mock user
      if (email === MOCK_USER.email || email.includes("@example.com")) {
        const mockUserId = "mock_user_" + email.replace("@", "_at_");
        cookies().set("appwrite-session", "mock-session-" + Date.now(), {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: false, // Allow in development
        });

        return parseStringify({
          ...MOCK_USER,
          userId: mockUserId,
          $id: mockUserId,
          email,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    }

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    if (!user) {
      throw new Error("User not found after sign in");
    }

    return parseStringify(user);
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const createNewUser = async ({
  password,
  ...userData
}: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );

    if (!newUserAccount) throw new Error("Error creating user");

    let dwollaCustomerUrl = "";
    let dwollaCustomerId = "";

    // Skip Dwolla in mock mode
    if (!isMockMode()) {
      dwollaCustomerUrl = await createDwollaCustomer({
        ...userData,
        type: "personal",
      });

      if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");
      dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    } else {
      // Mock Dwolla data
      dwollaCustomerId = "mock_customer_" + Date.now();
      dwollaCustomerUrl =
        "https://api-sandbox.dwolla.com/customers/" + dwollaCustomerId;
    }

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      },
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function getCurrentUser() {
  try {
    // In mock mode, check for mock session
    if (isMockMode()) {
      const cookieStore = cookies();
      const mockSession = cookieStore.get("appwrite-session");
      
      if (mockSession && mockSession.value.startsWith("mock-session-")) {
        // Extract email from session or use default
        return parseStringify({
          ...MOCK_USER,
          $id: MOCK_USER.userId,
        });
      }
      return null;
    }

    const { account } = await createSessionClient();

    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const signOutUser = async () => {
  try {
    // In mock mode, just delete the cookie
    if (isMockMode()) {
      cookies().delete("appwrite-session");
      return;
    }
    
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error", error);
  }
};

export const createLinkToken = async (user: User) => {
  try {
    // Check if in mock mode
    if (isMockMode()) {
      return parseStringify({ linkToken: "mock-link-token-" + Date.now() });
    }

    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({
      linkToken: response.data.link_token,
    });
  } catch (error) {
    console.error("Error", error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: CreateBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    );
    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: ExchangePublicTokenProps) => {
  try {
    // Exchange the public token for an access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);

    const processorToken = processorTokenResponse.data.processor_token;

    // Create a new funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, and account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while exchanging public token", error);
  }
};

// get user bank accounts
export const getBanks = async ({ userId }: BanksProps) => {
  try {
    // Check if in mock mode
    if (isMockMode()) {
      return parseStringify(MOCK_BANKS.map(bank => ({ ...bank, userId })));
    }

    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])],
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.error("Error:", error);
  }
};

// get specific bank from bank collection by document id
export const getBank = async ({ documentId }: BankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])],
    );

    // if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
  }
};

// get specific bank from bank collection by account id
export const getBankByAccountId = async ({
  accountId,
}: BankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])],
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};
