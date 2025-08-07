// Mock data for development without Plaid/Dwolla

export const MOCK_BANKS = [
  {
    id: "mock_bank_1",
    accountId: "mock_account_1",
    bankId: "chase",
    accessToken: "mock_access_token_1",
    fundingSourceUrl: "https://api-sandbox.dwolla.com/funding-sources/mock_1",
    userId: "",
    shareableId: "share_mock_1",
    institutionId: "ins_3",
    name: "Chase Checking",
    officialName: "Chase Total Checking",
    mask: "1234",
    type: "depository",
    subtype: "checking",
    availableBalance: 2850.75,
    currentBalance: 2910.75,
  },
  {
    id: "mock_bank_2",
    accountId: "mock_account_2",
    bankId: "bank_of_america",
    accessToken: "mock_access_token_2",
    fundingSourceUrl: "https://api-sandbox.dwolla.com/funding-sources/mock_2",
    userId: "",
    shareableId: "share_mock_2",
    institutionId: "ins_4",
    name: "Bank of America Savings",
    officialName: "Bank of America Advantage Savings",
    mask: "5678",
    type: "depository",
    subtype: "savings",
    availableBalance: 10500.5,
    currentBalance: 10500.5,
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: "mock_trans_1",
    $id: "mock_trans_1",
    name: "Spotify Premium",
    paymentChannel: "online",
    type: "debit",
    accountId: "mock_account_1",
    amount: 10.99,
    pending: false,
    category: "Entertainment",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/icons/spotify.svg",
    channel: "online",
    senderBankId: "mock_bank_1",
    receiverBankId: "",
    $createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock_trans_2",
    $id: "mock_trans_2",
    name: "Fresh & Co",
    paymentChannel: "in store",
    type: "debit",
    accountId: "mock_account_1",
    amount: 45.2,
    pending: false,
    category: "Food and Drink",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/icons/fresh-fv.svg",
    channel: "in store",
    senderBankId: "mock_bank_1",
    receiverBankId: "",
    $createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock_trans_3",
    $id: "mock_trans_3",
    name: "Transfer to Savings",
    paymentChannel: "online",
    type: "transfer",
    accountId: "mock_account_1",
    amount: 500.0,
    pending: false,
    category: "Transfer",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/icons/bank-transfer.svg",
    channel: "online",
    senderBankId: "mock_bank_1",
    receiverBankId: "mock_bank_2",
    $createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock_trans_4",
    $id: "mock_trans_4",
    name: "Coffee Shop",
    paymentChannel: "in store",
    type: "debit",
    accountId: "mock_account_1",
    amount: 4.5,
    pending: false,
    category: "Food and Drink",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/icons/a-coffee.svg",
    channel: "in store",
    senderBankId: "mock_bank_1",
    receiverBankId: "",
    $createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock_trans_5",
    $id: "mock_trans_5",
    name: "Direct Deposit",
    paymentChannel: "online",
    type: "credit",
    accountId: "mock_account_1",
    amount: 2500.0,
    pending: false,
    category: "Payment",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/icons/money-send.svg",
    channel: "online",
    senderBankId: "",
    receiverBankId: "mock_bank_1",
    $createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock_trans_6",
    $id: "mock_trans_6",
    name: "The Bread Factory",
    paymentChannel: "in store",
    type: "debit",
    accountId: "mock_account_1",
    amount: 12.75,
    pending: false,
    category: "Food and Drink",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/icons/tbfBakery.svg",
    channel: "in store",
    senderBankId: "mock_bank_1",
    receiverBankId: "",
    $createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_USER = {
  $id: "mock_user_1",
  email: "demo@subtlefi.com",
  userId: "mock_user_1",
  dwollaCustomerUrl: "https://api-sandbox.dwolla.com/customers/mock_customer",
  dwollaCustomerId: "mock_customer_id",
  firstName: "Demo",
  lastName: "User",
  name: "Demo User",
  address1: "123 Main Street",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  dateOfBirth: "1990-01-01",
  ssn: "1234",
};

// Helper to calculate spending by category
export const calculateSpendingByCategory = (
  transactions: typeof MOCK_TRANSACTIONS,
) => {
  const spending = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "debit") {
        const category = transaction.category || "Other";
        acc[category] = (acc[category] || 0) + transaction.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(spending).map(([category, amount]) => ({
    name: category,
    amount: amount,
    percentage: 0, // Will be calculated by the component
  }));
};

// Mock Credit Score Data
export const MOCK_CREDIT_SCORE: CreditScore = {
  userId: "mock_user_1",
  currentScore: 742,
  previousScore: 738,
  status: "Good",
  lastUpdated: new Date().toISOString().split("T")[0],
  scoreHistory: [
    { date: "2025-03", score: 720 },
    { date: "2025-04", score: 728 },
    { date: "2025-05", score: 735 },
    { date: "2025-06", score: 738 },
    { date: "2025-07", score: 740 },
    { date: "2025-08", score: 742 },
  ],
  keyFactors: [
    {
      name: "Payment History",
      description: "100% on-time payments",
      impact: "positive",
      percentage: 35,
    },
    {
      name: "Credit Utilization",
      description: "15% credit utilization",
      impact: "positive",
      percentage: 30,
    },
    {
      name: "Credit Age",
      description: "Average account age: 3 years",
      impact: "neutral",
      percentage: 15,
    },
    {
      name: "Credit Mix",
      description: "Limited variety of credit accounts",
      impact: "negative",
      percentage: 10,
    },
    {
      name: "New Credit",
      description: "No recent credit inquiries",
      impact: "positive",
      percentage: 10,
    },
  ],
  tips: [
    {
      id: "tip_1",
      title: "Excellent Score!",
      description:
        "Keep doing what you're doing. Continue paying on time and maintaining low balances.",
      icon: "/icons/check-circle.svg",
      priority: "low",
    },
    {
      id: "tip_2",
      title: "Consider Premium Cards",
      description:
        "With your excellent score, you qualify for the best rewards credit cards.",
      icon: "/icons/credit-card.svg",
      priority: "medium",
    },
    {
      id: "tip_3",
      title: "Check for Errors",
      description:
        "Review your credit report regularly for errors and dispute any inaccuracies.",
      icon: "/icons/alert-circle.svg",
      priority: "medium",
    },
    {
      id: "tip_4",
      title: "Become an Authorized User",
      description:
        "Being added to a family member's credit card with good payment history can boost your score.",
      icon: "/icons/users.svg",
      priority: "low",
    },
  ],
  breakdown: [
    { category: "Payment History", percentage: 35 },
    { category: "Credit Utilization", percentage: 30 },
    { category: "Length of Credit History", percentage: 15 },
    { category: "Credit Mix", percentage: 10 },
    { category: "New Credit", percentage: 10 },
  ],
  highestScore: 742,
  averageScore: 731,
};
