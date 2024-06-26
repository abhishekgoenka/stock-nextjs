"use server";

import { QueryTypes } from "sequelize";
import { connectDB } from "./base.service";
import moment from "moment";
import { calculateCAGR, calculateInterest, calculatePeriodDays, calculatePeriodYear, calculateSimpleInterest, calculateXIRR } from "@/lib/financial";
import { round } from "lodash";
import { parse, parseISO } from "date-fns";

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
export async function getPurchaseDetail(type: string, id: number): Promise<PurchaseDetailType | null> {
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

      // calculate growth rate
      const period = calculatePeriodYear(investmentDT);
      if (period > 0) {
        growthRate.percentage10 += calculateInterest(e.netAmount, 10, period);
        growthRate.percentage12 += calculateInterest(e.netAmount, 12, period);
        growthRate.percentage15 += calculateInterest(e.netAmount, 15, period);
        growthRate.percentage18 += calculateInterest(e.netAmount, 18, period);
        growthRate.percentage24 += calculateInterest(e.netAmount, 24, period);
      } else {
        let periodDays = calculatePeriodDays(investmentDT);
        periodDays = periodDays + 1;
        growthRate.percentage10 += calculateSimpleInterest(e.netAmount, periodDays, 10);
        growthRate.percentage12 += calculateSimpleInterest(e.netAmount, periodDays, 12);
        growthRate.percentage15 += calculateSimpleInterest(e.netAmount, periodDays, 15);
        growthRate.percentage18 += calculateSimpleInterest(e.netAmount, periodDays, 18);
        growthRate.percentage24 += calculateSimpleInterest(e.netAmount, periodDays, 24);
      }
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

// public async getPurchaseDetailByBroker(broker: string): Promise<any> {
//   try {
//     if (broker === "DHAN") {
//       broker = "DHANN";
//     } else if (broker === "Fidility Roth") {
//       broker = "FidilityRoth";
//     } else if (broker === "Fidility Traditional") {
//       broker = "FidilityTraditional";
//     } else if (broker === "Fidility Individual") {
//       broker = "FidilityIndividual";
//     }
//     const queryStock = `SELECT s.id, c.id as companyID,  c.name, purchaseDate, qty, price,  currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , ((c.currentPrice * qty)+stt+brokerage+otherCharges) AS currentAmount, currency, 'stock' as type
//     FROM StockInvestments s JOIN Companies c on s.companyID = c.id WHERE s.broker = :broker  ORDER BY purchaseDate desc`;

//     const queryMF = `SELECT mi.id, mf.id as companyID, mf.name, purchaseDate, qty, price, mf.currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , (mf.currentPrice * qty) AS currentAmount, currency, 'mf' as type
//               FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
//               WHERE mi.broker = :broker  ORDER BY purchaseDate desc`;

//     let result: Array<{
//       id;
//       companyID;
//       name;
//       purchaseDate;
//       qty;
//       price;
//       currentPrice;
//       grossAmount;
//       netAmount;
//       broker;
//       currentAmount;
//       currency;
//       XIRR;
//       CAGR;
//       type;
//     }> = await this.sequelize.query(queryStock, {
//       replacements: { broker: broker },
//       type: QueryTypes.SELECT,
//     });
//     const resultMF: Array<{
//       id;
//       companyID;
//       name;
//       purchaseDate;
//       qty;
//       price;
//       currentPrice;
//       grossAmount;
//       netAmount;
//       broker;
//       currentAmount;
//       currency;
//       XIRR;
//       CAGR;
//       type;
//     }> = await this.sequelize.query(queryMF, {
//       replacements: { broker: broker },
//       type: QueryTypes.SELECT,
//     });

//     result.push(...resultMF);

//     result = _.orderBy(result, "purchaseDate", "desc");

//     let investedValue = 0;
//     let qty = 0;
//     let totalProfit = 0;
//     result.forEach((e) => {
//       investedValue += e.netAmount;
//       qty += e.qty;
//       const investmentDT = moment(e.purchaseDate, "YYYY-MM-DD");

//       let na = e.netAmount * -1;
//       let rate = 0;
//       if (e.netAmount !== 0) {
//         rate = Financial.calculateXIRR([
//           { amount: na, when: investmentDT },
//           { amount: e.currentAmount, when: moment() },
//         ]);
//       }

//       e.XIRR = rate * 100;
//       e.CAGR = Financial.calculateCAGR(e.purchaseDate, e.price, e.currentPrice);
//       totalProfit += e.currentAmount - e.netAmount;
//     });

//     return { totalProfit, broker, investedValue, data: result };

//     // return result;
//   } catch (ex) {
//     console.error(ex);
//     throw "Failed to get detail";
//   }
// }
