"use server";

import { MOCK_CREDIT_SCORE } from "../mock-data";
import { parseStringify } from "../utils";

// Get current credit score
export const getCreditScore = async ({
  userId,
}: CreditScoreProps): Promise<CreditScore> => {
  try {
    // In production, this would fetch from a credit score API
    // For now, return mock data
    return parseStringify({
      ...MOCK_CREDIT_SCORE,
      userId,
    });
  } catch (error) {
    console.error("Error fetching credit score:", error);
    throw new Error("Failed to fetch credit score");
  }
};

// Get credit score history
export const getCreditScoreHistory = async ({
  userId,
}: CreditScoreProps): Promise<CreditScoreHistory[]> => {
  try {
    const creditScore = await getCreditScore({ userId });
    return creditScore.scoreHistory;
  } catch (error) {
    console.error("Error fetching credit score history:", error);
    throw new Error("Failed to fetch credit score history");
  }
};

// Get credit score tips
export const getCreditScoreTips = async ({
  userId,
}: CreditScoreProps): Promise<CreditScoreTip[]> => {
  try {
    const creditScore = await getCreditScore({ userId });
    return creditScore.tips;
  } catch (error) {
    console.error("Error fetching credit score tips:", error);
    throw new Error("Failed to fetch credit score tips");
  }
};

// Get credit score factors
export const getCreditScoreFactors = async ({
  userId,
}: CreditScoreProps): Promise<CreditScoreFactor[]> => {
  try {
    const creditScore = await getCreditScore({ userId });
    return creditScore.keyFactors;
  } catch (error) {
    console.error("Error fetching credit score factors:", error);
    throw new Error("Failed to fetch credit score factors");
  }
};

// Get credit score breakdown
export const getCreditScoreBreakdown = async ({
  userId,
}: CreditScoreProps): Promise<CreditScoreBreakdown[]> => {
  try {
    const creditScore = await getCreditScore({ userId });
    return creditScore.breakdown;
  } catch (error) {
    console.error("Error fetching credit score breakdown:", error);
    throw new Error("Failed to fetch credit score breakdown");
  }
};