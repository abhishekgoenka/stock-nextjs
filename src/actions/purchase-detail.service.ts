"use server";

import { QueryTypes } from "sequelize";
import { connectDB } from "./base.service";
import { calculateCAGR, calculateInterest, calculateXIRR } from "@/lib/financial";
import { orderBy, round } from "lodash";
import { parseISO } from "date-fns";
import { StockOrMutualFundType } from "@/lib/constants";

type InvestmentGrouthRate = {
  percentage10: number;
  percentage12: number;
  percentage15: number;
  percentage18: number;
  percentage24: number;
};
type InvestmentDetailType = {
  id: number;
  name: string;
  purchaseDate: string;
  qty: number;
  price: number;
  currentPrice: number;
  grossAmount: number;
  netAmount: number;
  broker: string;
  currentAmount: number;
  currency: string;
  XIRR: number;
  CAGR: number;
};
export type PurchaseDetailType = {
  totalXIRR: number;
  currentPrice: number;
  investedValue: number;
  qty: number;
  returns: number;
  avgPrice: number;
  growthRate: InvestmentGrouthRate;
  data: InvestmentDetailType[];
};
export async function getPurchaseDetail(type: StockOrMutualFundType, id: number): Promise<PurchaseDetailType | null> {
  try {
    const sequelize = await connectDB();
    let query = ` SELECT STRFTIME("%Y", [date]) as year, SUM(amount) as amount FROM Deposits WHERE currency = :currency
                          GROUP BY STRFTIME("%Y", [date]),  [desc]   HAVING [desc] = 'Divident Received' ORDER By [date]`;

    if (type === "stock") {
      query = `SELECT s.id,  c.name, purchaseDate, qty, price,  currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , ((c.currentPrice * qty)+stt+brokerage+otherCharges) AS currentAmount, currency
                        FROM StockInvestments s JOIN Companies c on s.companyID = c.id WHERE c.id = :id ORDER BY purchaseDate desc`;
    } else {
      query = `SELECT mi.id, mf.name, purchaseDate, qty, price, mf.currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , (mf.currentPrice * qty) AS currentAmount, currency
                FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
                WHERE mf.id = :id ORDER BY purchaseDate desc`;
    }

    const result: InvestmentDetailType[] = await sequelize.query(query, {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    });

    let currentPrice = 0;
    let investedValue = 0;
    let qty = 0;
    const totalXIRRData: {
      amount: number;
      when: Date;
    }[] = [];
    const growthRate: InvestmentGrouthRate = {
      percentage10: 0,
      percentage12: 0,
      percentage15: 0,
      percentage18: 0,
      percentage24: 0,
    };
    result.forEach(e => {
      currentPrice = e.currentPrice;
      investedValue += e.netAmount;
      qty += e.qty;
      const investmentDT = parseISO(e.purchaseDate);
      let rate = 0;
      if (e.netAmount !== 0) {
        rate = calculateXIRR([
          { amount: e.netAmount * -1, when: investmentDT },
          { amount: e.currentAmount, when: new Date() },
        ]);
      }

      totalXIRRData.push({ amount: e.netAmount * -1, when: investmentDT });
      e.XIRR = rate * 100;
      e.CAGR = calculateCAGR(investmentDT, e.price, e.currentPrice);

      growthRate.percentage10 += calculateInterest(investmentDT, e.netAmount, 10);
      growthRate.percentage12 += calculateInterest(investmentDT, e.netAmount, 12);
      growthRate.percentage15 += calculateInterest(investmentDT, e.netAmount, 15);
      growthRate.percentage18 += calculateInterest(investmentDT, e.netAmount, 18);
      growthRate.percentage24 += calculateInterest(investmentDT, e.netAmount, 24);
    });

    totalXIRRData.push({ amount: qty * currentPrice, when: new Date() });
    const returns = qty * currentPrice - investedValue;
    const avgPrice = investedValue / qty;
    const totalXIRR = calculateXIRR(totalXIRRData) * 100;

    growthRate.percentage10 = round(growthRate.percentage10, 2);
    growthRate.percentage12 = round(growthRate.percentage12, 2);
    growthRate.percentage15 = round(growthRate.percentage15, 2);
    growthRate.percentage18 = round(growthRate.percentage18, 2);
    growthRate.percentage24 = round(growthRate.percentage24, 2);

    return {
      totalXIRR,
      currentPrice,
      investedValue,
      qty,
      returns,
      avgPrice,
      growthRate,
      data: result,
    };

    // return result;
  } catch (ex) {
    console.error(ex);
    throw "Failed to get purchase detail";
  }
}

export type PurchaseDetailByBrokerType = {
  totalProfit: number;
  broker: string;
  investedValue: number;
  data: PurchaseDetailByBrokerResultType[];
};
type PurchaseDetailByBrokerResultType = {
  id: number;
  companyID: number;
  name: string;
  purchaseDate: string;
  qty: number;
  price: number;
  currentPrice: number;
  grossAmount: number;
  netAmount: number;
  broker: string;
  currentAmount: number;
  currency: string;
  XIRR: number;
  CAGR: number;
  type: string;
};
export async function getPurchaseDetailByBroker(broker: string): Promise<any> {
  const sequelize = await connectDB();
  if (broker === "Fidility Roth") {
    broker = "FidilityRoth";
  } else if (broker === "Fidility Traditional") {
    broker = "FidilityTraditional";
  } else if (broker === "Fidility Individual") {
    broker = "FidilityIndividual";
  }
  const queryStock = `SELECT s.id, c.id as companyID,  c.name, purchaseDate, qty, price,  currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , ((c.currentPrice * qty)+stt+brokerage+otherCharges) AS currentAmount, currency, 'stock' as type
  FROM StockInvestments s JOIN Companies c on s.companyID = c.id WHERE s.broker = :broker  ORDER BY purchaseDate desc`;

  const queryMF = `SELECT mi.id, mf.id as companyID, mf.name, purchaseDate, qty, price, mf.currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , (mf.currentPrice * qty) AS currentAmount, currency, 'mf' as type
            FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
            WHERE mi.broker = :broker  ORDER BY purchaseDate desc`;

  let result: PurchaseDetailByBrokerResultType[] = await sequelize.query(queryStock, {
    replacements: { broker: broker },
    type: QueryTypes.SELECT,
  });
  const resultMF: PurchaseDetailByBrokerResultType[] = await sequelize.query(queryMF, {
    replacements: { broker: broker },
    type: QueryTypes.SELECT,
  });

  result.push(...resultMF);

  result = orderBy(result, "purchaseDate", "desc");

  let investedValue = 0;
  let totalProfit = 0;
  result.forEach(e => {
    investedValue += e.netAmount;
    const investmentDT = parseISO(e.purchaseDate);

    let na = e.netAmount * -1;
    let rate = 0;
    if (e.netAmount !== 0) {
      rate = calculateXIRR([
        { amount: na, when: investmentDT },
        { amount: e.currentAmount, when: new Date() },
      ]);
    }

    e.XIRR = rate * 100;
    e.CAGR = calculateCAGR(investmentDT, e.price, e.currentPrice);
    totalProfit += e.currentAmount - e.netAmount;
  });

  return { totalProfit, broker, investedValue, data: result };
}
