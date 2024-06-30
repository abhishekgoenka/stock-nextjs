"use server";

import { QueryTypes } from "sequelize";
import { connectDB } from "./base.service";
import { getCompountedInterest } from "@/lib/financial";

export type TotalInvestmentType = {
  totalINRInvestments: number;
  totalUSDInvestments: number;
};
export async function getTotalInvestment(): Promise<TotalInvestmentType> {
  type ResultType = { amount: number; currency: string };
  const sequelize = await connectDB();
  let query = `SELECT sum(((qty*price)+stt+brokerage+otherCharges)) AS amount, currency
                FROM StockInvestments GROUP BY currency`;

  const stockResult: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  query = `SELECT sum(((qty*price)+stt+brokerage+otherCharges)) AS amount, currency
              FROM MutualFundInvestments GROUP BY currency`;
  const mfResult: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  const totalINRInvestments = mfResult[0].amount + stockResult.find(e => e.currency === "INR")!.amount;
  const totalUSDInvestments = stockResult.find(e => e.currency === "USD")!.amount;

  const ret = {
    totalINRInvestments,
    totalUSDInvestments,
  };

  return ret;
}

export type InvestmentReturnType = {
  profitINR: number;
  profitUSD: number;
};
export async function getInvestmentReturn(): Promise<InvestmentReturnType> {
  type ResultType = { amount: number; currency: string };
  const sequelize = await connectDB();

  let query = `SELECT currency, ((sum((c.currentPrice * qty)) ) - sum( ((qty*price)+stt+brokerage+otherCharges)) ) AS amount
            FROM StockInvestments s JOIN Companies c on s.companyID = c.id
            GROUP BY currency`;
  const stockProfit: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  query = `SELECT currency, (sum((mf.currentPrice * qty)) - sum((qty*price)+stt+brokerage+otherCharges)) AS amount
              FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
              GROUP BY currency`;
  const mfProfit: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  const profitUSD = stockProfit.find(e => e.currency === "USD")!.amount;
  const profitINR = stockProfit.find(e => e.currency === "INR")!.amount + mfProfit[0].amount;

  const ret = {
    profitINR,
    profitUSD,
  };

  return ret;
}

export type EstimatedReturnType = {
  projectedINRReturn12: number;
  projectedINRReturn15: number;
  projectedUSDReturn12: number;
  projectedUSDReturn15: number;
};
export async function getEstimatedReturn(year: number): Promise<EstimatedReturnType> {
  const totalInvestments = await getTotalInvestment();
  const investmentReturns = await getInvestmentReturn();

  const balanceYear = year - new Date().getFullYear();
  const currentValueINR = totalInvestments.totalINRInvestments + investmentReturns.profitINR;
  const currentValueUSD = totalInvestments.totalUSDInvestments + investmentReturns.profitUSD;
  const componentInterestINR12 = getCompountedInterest(currentValueINR, 12, balanceYear);
  const componentInterestINR15 = getCompountedInterest(currentValueINR, 15, balanceYear);
  const componentInterestUSD12 = getCompountedInterest(currentValueUSD, 12, balanceYear);
  const componentInterestUSD15 = getCompountedInterest(currentValueUSD, 15, balanceYear);

  const ret = {
    projectedINRReturn12: componentInterestINR12.total,
    projectedINRReturn15: componentInterestINR15.total,
    projectedUSDReturn12: componentInterestUSD12.total,
    projectedUSDReturn15: componentInterestUSD15.total,
  };

  return ret;
}

export type DashboardOverviewType = TotalInvestmentType &
  InvestmentReturnType & {
    projectedINRReturn12: number;
    projectedINRReturn15: number;
    projectedUSDReturn12: number;
    projectedUSDReturn15: number;
  };
export async function getDashboardOverview(): Promise<DashboardOverviewType> {
  type ResultType = { amount: number; currency: string };
  const sequelize = await connectDB();
  let query = `SELECT sum(((qty*price)+stt+brokerage+otherCharges)) AS amount, currency
                FROM StockInvestments GROUP BY currency`;

  const stockResult: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  query = `SELECT sum(((qty*price)+stt+brokerage+otherCharges)) AS amount, currency
              FROM MutualFundInvestments GROUP BY currency`;
  const mfResult: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  query = `SELECT currency, ((sum((c.currentPrice * qty)) ) - sum( ((qty*price)+stt+brokerage+otherCharges)) ) AS amount
            FROM StockInvestments s JOIN Companies c on s.companyID = c.id
            GROUP BY currency`;
  const stockProfit: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  query = `SELECT currency, (sum((mf.currentPrice * qty)) - sum((qty*price)+stt+brokerage+otherCharges)) AS amount
              FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
              GROUP BY currency`;
  const mfProfit: ResultType[] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  const totalINRInvestments = mfResult[0].amount + stockResult.find(e => e.currency === "INR")!.amount;
  const totalUSDInvestments = stockResult.find(e => e.currency === "USD")!.amount;
  const profitUSD = stockProfit.find(e => e.currency === "USD")!.amount;
  const profitINR = stockProfit.find(e => e.currency === "INR")!.amount + mfProfit[0].amount;

  const balanceYear = 2042 - new Date().getFullYear();
  const componentInterestINR12 = getCompountedInterest(totalINRInvestments + profitINR, 12, balanceYear);
  const componentInterestINR15 = getCompountedInterest(totalINRInvestments + profitINR, 15, balanceYear);
  const componentInterestUSD12 = getCompountedInterest(totalUSDInvestments + profitUSD, 12, balanceYear);
  const componentInterestUSD15 = getCompountedInterest(totalUSDInvestments + profitUSD, 15, balanceYear);

  const ret = {
    totalINRInvestments,
    totalUSDInvestments,
    profitINR,
    profitUSD,
    projectedINRReturn12: componentInterestINR12.total,
    projectedINRReturn15: componentInterestINR15.total,
    projectedUSDReturn12: componentInterestUSD12.total,
    projectedUSDReturn15: componentInterestUSD15.total,
  };

  return ret;
}

// export async function getDashboardOverview(): Promise<any> {
//   try {
//     let query = `SELECT sum(((qty*price)+stt+brokerage+otherCharges)) AS amount, currency
//                 FROM StockInvestments GROUP BY currency`;

//     const stockResult: Array<{ amount; currency }> =
//       await this.sequelize.query(query, {
//         type: QueryTypes.SELECT
//       });

//     query = `SELECT sum(((qty*price)+stt+brokerage+otherCharges)) AS amount, currency
//               FROM MutualFundInvestments GROUP BY currency`;
//     const mfResult: Array<{ amount; currency }> = await this.sequelize.query(
//       query,
//       {
//         type: QueryTypes.SELECT
//       }
//     );

//     query = `SELECT currency, ((sum((c.currentPrice * qty)) ) - sum( ((qty*price)+stt+brokerage+otherCharges)) ) AS amount
//             FROM StockInvestments s JOIN Companies c on s.companyID = c.id
//             GROUP BY currency`;
//     const stockProfit: Array<{ currency; amount }> = await this.sequelize.query(
//       query,
//       {
//         type: QueryTypes.SELECT
//       }
//     );

//     query = `SELECT currency, (sum((mf.currentPrice * qty)) - sum((qty*price)+stt+brokerage+otherCharges)) AS amount
//               FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
//               GROUP BY currency`;
//     const mfProfit: Array<{ currency; amount }> = await this.sequelize.query(
//     query,
//     {
//       type: QueryTypes.SELECT
//     }
//     );

//     const totalINRInvestments = mfResult[0].amount + stockResult.find((e) => e.currency === "INR").amount
//     const totalUSDInvestments = stockResult.find((e) => e.currency === "USD").amount
//     const profitUSD = stockProfit.find(e => e.currency === 'USD').amount
//     const profitINR = stockProfit.find(e => e.currency === 'INR').amount + mfProfit[0].amount

//     const balanceYear = 2042 - new Date().getFullYear()
//     const componentInterestINR12 = Financial.getCompountedInterest(totalINRInvestments + profitINR, 12, balanceYear)
//     const componentInterestINR15 = Financial.getCompountedInterest(totalINRInvestments + profitINR, 15, balanceYear)
//     const componentInterestUSD12 = Financial.getCompountedInterest(totalUSDInvestments + profitUSD, 12, balanceYear)
//     const componentInterestUSD15 = Financial.getCompountedInterest(totalUSDInvestments + profitUSD, 15, balanceYear)

//     const ret = {
//       totalINRInvestments,
//       totalUSDInvestments,
//       profitINR,
//       profitUSD ,
//       projectedINRReturn12: componentInterestINR12.total,
//       projectedINRReturn15: componentInterestINR15.total,
//       projectedUSDReturn12: componentInterestUSD12.total,
//       projectedUSDReturn15: componentInterestUSD15.total
//     };

//     return ret;
//   } catch (ex) {
//     console.error(ex);
//     throw "Failed to get all dashboard data";
//   }
// }

// export class DashboardService extends BaseService {
//   constructor() {
//     super();
//   }

// }
