"use server";

import { Op, QueryTypes } from "sequelize";
import { BaseService, connectDB } from "./base.service";
// import * as _ from "lodash";
// import moment from "moment";
import { interest } from "capitaljs";
import Deposit from "../models/deposit.model";
import { differenceInDays, differenceInYears, lightFormat, parse } from "date-fns";
import { round, slice, sortBy, sumBy } from "lodash";
import { calculatePeriodDays, calculatePeriodYear, calculateSimpleInterest } from "@/lib/financial";
// import { Financial } from "../helpers/financial";
// import Sale from "../models/sale.model";
// import { Logger } from "../helpers/logger";
// var xirr = require("xirr");
// const logger = Logger.getLogger("index");
export type MonthlyInvestmentType = {
  month: Date;
  stocks: number;
  etf: number;
  mutualFunds: number;
  total: number;
};
export async function getMonthlyInvestments(exchange: string): Promise<MonthlyInvestmentType[]> {
  try {
    const MAX_RETURN_MONTHS = 10;
    const stockSQL = `SELECT STRFTIME("%m-%Y", purchaseDate) AS month,
                        sum((qty*price)+stt+brokerage+otherCharges) AS stocks
                        FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                        WHERE c.exchange = :exchange AND c.sector != 'ETF'
                        GROUP By STRFTIME("%m-%Y", purchaseDate) ORDER By purchaseDate`;

    const sequelize = await connectDB();
    const stocks: Array<{ month; stocks }> = await sequelize.query(stockSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const stockETFSQL = `SELECT STRFTIME("%m-%Y", purchaseDate) AS month,
                            sum((qty*price)+stt+brokerage+otherCharges) AS etf
                            FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                            WHERE c.exchange = :exchange AND c.sector = 'ETF'
                            GROUP By STRFTIME("%m-%Y", purchaseDate) ORDER By purchaseDate`;
    const etfs: Array<{ month; etf; isMerged }> = await sequelize.query(stockETFSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const mfSQL = `SELECT STRFTIME("%m-%Y", purchaseDate) AS month,
                    sum((qty*price)+stt+brokerage+otherCharges) AS mutualFund
                    FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
                    WHERE exchange = :exchange
                    GROUP By STRFTIME("%m-%Y", purchaseDate) ORDER By purchaseDate`;
    const mutualFunds: Array<{ month; mutualFund; isMerged }> = await sequelize.query(mfSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });
    const result: MonthlyInvestmentType[] = [];
    stocks.forEach(s => {
      const mfIndex = mutualFunds.findIndex(e => e.month === s.month);
      const etfIndex = etfs.findIndex(e => e.month === s.month);

      let total = s.stocks;
      let mutualFund = 0;
      let etf = 0;
      if (mfIndex > -1) {
        mutualFund = mutualFunds[mfIndex].mutualFund;
        mutualFunds[mfIndex].isMerged = true;
        total += mutualFund;
      }
      if (etfIndex > -1) {
        etf = etfs[etfIndex].etf;
        etfs[etfIndex].isMerged = true;
        total += etf;
      }
      result.push({
        month: parse(`01-${s.month}`, "dd-MM-yyyy", new Date()),
        stocks: s.stocks,
        etf: etf,
        mutualFunds: mutualFund,
        total,
      });
    });

    mutualFunds.forEach(m => {
      if (!m.isMerged) {
        result.push({
          month: parse(`01-${m.month}`, "dd-MM-yyyy", new Date()),
          stocks: 0,
          etf: 0,
          mutualFunds: m.mutualFund,
          total: round(m.mutualFund, 0),
        });
      }
    });

    etfs.forEach(m => {
      if (!m.isMerged) {
        result.push({
          month: parse(`01-${m.month}`, "dd-MM-yyyy", new Date()),
          stocks: 0,
          etf: m.etf,
          mutualFunds: 0,
          total: m.etf,
        });
      }
    });

    // round off
    result.forEach(e => {
      e.stocks = round(e.stocks, 0);
      e.etf = round(e.etf, 0);
      e.mutualFunds = round(e.mutualFunds, 0);
      e.total = round(e.total, 0);
    });

    const sortedDate = sortBy(result, "month");
    if (sortedDate.length > MAX_RETURN_MONTHS) {
      return slice(sortedDate, sortedDate.length - MAX_RETURN_MONTHS, sortedDate.length);
    } else {
      return sortedDate;
    }
  } catch (ex) {
    console.error(ex);
    return [];
  }
}

export type YearlyInvestmentType = {
  year: number;
  stocks: number;
  etf: number;
  mutualFunds: number;
  total: number;
};
export async function getYearlyInvestments(exchange: string): Promise<YearlyInvestmentType[]> {
  try {
    const sequelize = await connectDB();
    const stockSQL = `SELECT STRFTIME("%Y", purchaseDate) AS year,
                        sum((qty*price)+stt+brokerage+otherCharges) AS stocks
                        FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                        WHERE c.exchange = :exchange AND c.sector != 'ETF'
                        GROUP By STRFTIME("%Y", purchaseDate) ORDER By purchaseDate`;
    const stocks: Array<{ year; stocks }> = await sequelize.query(stockSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const stockETFSQL = `SELECT STRFTIME("%Y", purchaseDate) AS year,
                        sum((qty*price)+stt+brokerage+otherCharges) AS etf
                        FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                        WHERE c.exchange = :exchange AND c.sector = 'ETF'
                        GROUP By STRFTIME("%Y", purchaseDate) ORDER By purchaseDate`;
    const etfs: Array<{ year; etf; isMerged }> = await sequelize.query(stockETFSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const mfSQL = `SELECT STRFTIME("%Y", purchaseDate) AS year,
                      sum((qty*price)+stt+brokerage+otherCharges) AS mutualFund
                    FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
                    WHERE exchange = :exchange
                    GROUP By STRFTIME("%Y", purchaseDate) ORDER By purchaseDate`;
    const mutualFunds: Array<{ year; mutualFund; isMerged }> = await sequelize.query(mfSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });
    const result: YearlyInvestmentType[] = [];
    stocks.forEach(s => {
      const mfIndex = mutualFunds.findIndex(e => e.year === s.year);
      const etfIndex = etfs.findIndex(e => e.year === s.year);
      let total = s.stocks;
      let mutualFund = 0;
      let etf = 0;
      if (mfIndex > -1) {
        mutualFund = mutualFunds[mfIndex].mutualFund;
        mutualFunds[mfIndex].isMerged = true;
        total += mutualFund;
      }
      if (etfIndex > -1) {
        etf = etfs[etfIndex].etf;
        etfs[etfIndex].isMerged = true;
        total += etf;
      }
      result.push({
        year: s.year,
        stocks: s.stocks,
        etf: etf,
        mutualFunds: mutualFund,
        total,
      });
    });

    mutualFunds.forEach(m => {
      if (!m.isMerged) {
        result.push({
          year: m.year,
          stocks: 0,
          etf: 0,
          mutualFunds: m.mutualFund,
          total: m.mutualFund,
        });
      }
    });

    etfs.forEach(m => {
      if (!m.isMerged) {
        result.push({
          year: m.year,
          stocks: 0,
          etf: m.etf,
          mutualFunds: 0,
          total: m.etf,
        });
      }
    });

    const sortedDate = sortBy(result, "year");
    return sortedDate;
  } catch (ex) {
    console.error(ex);
    return [];
  }
}

type ReturnType = {
  broker: string;
  percentage12: number;
  percentage15: number;
  actual: number;
  isUsed?: boolean;
};
export type ExpectedReturnType = {
  netWorth: number;
  returns: ReturnType[];
  total: ReturnType;
};

export async function expectedReturn(exchange: string): Promise<ExpectedReturnType | null> {
  try {
    const RATE_12 = 12;
    const RATE_15 = 15;
    const sequelize = await connectDB();
    const stockSQL = `SELECT s.id, purchaseDate, ((qty*price)+stt+brokerage+otherCharges) AS purchasePrice, broker, (c.currentPrice * qty) AS currentAmount
                        FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                        WHERE c.exchange = :exchange  `;
    const stocks: Array<{
      id;
      purchaseDate;
      purchasePrice;
      broker;
      currentAmount;
    }> = await sequelize.query(stockSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const mutualFundSQL = `SELECT mi.id, purchaseDate, ((qty*price)+stt+brokerage+otherCharges) AS purchasePrice, broker, (mf.currentPrice * qty) AS currentAmount
                              FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
                              WHERE exchange = :exchange `;
    const mutualFunds: Array<{
      id: number;
      purchaseDate: Date;
      purchasePrice: number;
      broker: string;
      currentAmount: number;
    }> = await sequelize.query(mutualFundSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const totalInvestmentsSQL = `SELECT sum((qty*price)+stt+brokerage+otherCharges) AS stocks   FROM StockInvestments s JOIN Companies c on s.companyID = c.id WHERE c.exchange = :exchange
                            UNION ALL
                            SELECT   sum((qty*price)+stt+brokerage+otherCharges)  as mutualFunds  FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID WHERE exchange = :exchange`;

    const totalInvestments: Array<{
      stocks;
    }> = await sequelize.query(totalInvestmentsSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const growwStock = {
      broker: "Stock GROWW",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const growwMF = {
      broker: "Mutual Fund GROWW",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const dhannStock = {
      broker: "Stock DHANN",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const fidilityRoth = {
      broker: "Fidility Roth",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const WEBULL = {
      broker: "WEBULL",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const fidilityTraditional = {
      broker: "Fidility Traditional",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const fidilityIndividual = {
      broker: "Fidility Individual",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const zerodha = {
      broker: "ZERODHA",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };
    const upstox = {
      broker: "UPSTOX",
      percentage12: 0,
      percentage15: 0,
      actual: 0,
      isUsed: false,
    };

    stocks.forEach(s => {
      const period = calculatePeriodYear(s.purchaseDate);
      let interest12 = 0;
      let interest15 = 0;
      if (period > 0) {
        const percentage12 = interest({
          principal: s.purchasePrice,
          rate: RATE_12,
          periods: period,
          compoundings: 1,
        });
        const percentage15 = interest({
          principal: s.purchasePrice,
          rate: RATE_15,
          periods: period,
          compoundings: 1,
        });
        interest12 = round(percentage12.interest, 2);
        interest15 = round(percentage15.interest, 2);
      } else {
        let periodDays = calculatePeriodDays(s.purchaseDate);
        periodDays = periodDays + 1;
        interest12 = calculateSimpleInterest(s.purchasePrice, periodDays, 12);
        interest15 = calculateSimpleInterest(s.purchasePrice, periodDays, 15);
      }

      if (s.broker === "GROWW") {
        growwStock.percentage12 += interest12;
        growwStock.percentage15 += interest15;
        growwStock.actual += s.currentAmount - s.purchasePrice;
        growwStock.isUsed = true;
      } else if (s.broker === "DHANN") {
        dhannStock.percentage12 += interest12;
        dhannStock.percentage15 += interest15;
        dhannStock.actual += s.currentAmount - s.purchasePrice;
        dhannStock.isUsed = true;
      } else if (s.broker === "ZERODHA") {
        zerodha.percentage12 += interest12;
        zerodha.percentage15 += interest15;
        zerodha.actual += s.currentAmount - s.purchasePrice;
        zerodha.isUsed = true;
      } else if (s.broker === "UPSTOX") {
        upstox.percentage12 += interest12;
        upstox.percentage15 += interest15;
        upstox.actual += s.currentAmount - s.purchasePrice;
        upstox.isUsed = true;
      } else if (s.broker === "WEBULL") {
        WEBULL.percentage12 += interest12;
        WEBULL.percentage15 += interest15;
        WEBULL.actual += s.currentAmount - s.purchasePrice;
        WEBULL.isUsed = true;
      } else if (s.broker === "FidilityRoth") {
        fidilityRoth.percentage12 += interest12;
        fidilityRoth.percentage15 += interest15;
        fidilityRoth.actual += s.currentAmount - s.purchasePrice;
        fidilityRoth.isUsed = true;
      } else if (s.broker === "FidilityTraditional") {
        fidilityTraditional.percentage12 += interest12;
        fidilityTraditional.percentage15 += interest15;
        fidilityTraditional.actual += s.currentAmount - s.purchasePrice;
        fidilityTraditional.isUsed = true;
      } else if (s.broker === "FidilityIndividual") {
        fidilityIndividual.percentage12 += interest12;
        fidilityIndividual.percentage15 += interest15;
        fidilityIndividual.actual += s.currentAmount - s.purchasePrice;
        fidilityIndividual.isUsed = true;
      }
    });
    mutualFunds.forEach(s => {
      const period = calculatePeriodYear(s.purchaseDate);
      let interest12 = 0;
      let interest15 = 0;
      if (period > 0) {
        const percentage12 = interest({
          principal: s.purchasePrice,
          rate: RATE_12,
          periods: period,
          compoundings: 1,
        });
        const percentage15 = interest({
          principal: s.purchasePrice,
          rate: RATE_15,
          periods: period,
          compoundings: 1,
        });
        interest12 = round(percentage12.interest, 2);
        interest15 = round(percentage15.interest, 2);
      } else {
        let periodDays = calculatePeriodDays(s.purchaseDate);

        periodDays = periodDays + 1;
        interest12 = (s.purchasePrice * RATE_12 * periodDays) / 36525;
        interest15 = (s.purchasePrice * RATE_15 * periodDays) / 36525;
      }

      if (s.broker === "GROWW") {
        growwMF.percentage12 += interest12;
        growwMF.percentage15 += interest15;
        growwMF.actual += s.currentAmount - s.purchasePrice;
        growwMF.isUsed = true;
      } else if (s.broker === "ZERODHA") {
        zerodha.percentage12 += interest12;
        zerodha.percentage15 += interest15;
        zerodha.actual += s.currentAmount - s.purchasePrice;
        zerodha.isUsed = true;
      } else if (s.broker === "UPSTOX") {
        upstox.percentage12 += interest12;
        upstox.percentage15 += interest15;
        upstox.actual += s.currentAmount - s.purchasePrice;
        upstox.isUsed = true;
      }
    });

    const total: ReturnType = {
      broker: "Total",
      percentage12:
        growwStock.percentage12 +
        growwMF.percentage12 +
        dhannStock.percentage12 +
        zerodha.percentage12 +
        upstox.percentage12 +
        WEBULL.percentage12 +
        fidilityIndividual.percentage12 +
        fidilityRoth.percentage12 +
        fidilityTraditional.percentage12,
      percentage15:
        growwStock.percentage15 +
        growwMF.percentage15 +
        dhannStock.percentage15 +
        zerodha.percentage15 +
        upstox.percentage15 +
        WEBULL.percentage15 +
        fidilityIndividual.percentage15 +
        fidilityRoth.percentage15 +
        fidilityTraditional.percentage15,
      actual:
        growwStock.actual +
        dhannStock.actual +
        growwMF.actual +
        zerodha.actual +
        upstox.actual +
        WEBULL.actual +
        fidilityIndividual.actual +
        fidilityRoth.actual +
        fidilityTraditional.actual,
    };
    const ret: ReturnType[] = [];

    if (growwStock.isUsed) {
      ret.push(growwStock);
    }
    if (dhannStock.isUsed) {
      ret.push(dhannStock);
    }
    if (growwMF.isUsed) {
      ret.push(growwMF);
    }
    if (zerodha.isUsed) {
      ret.push(zerodha);
    }
    if (upstox.isUsed) {
      ret.push(upstox);
    }

    if (WEBULL.isUsed) {
      ret.push(WEBULL);
    }
    if (fidilityIndividual.isUsed) {
      ret.push(fidilityIndividual);
    }
    if (fidilityRoth.isUsed) {
      ret.push(fidilityRoth);
    }
    if (fidilityTraditional.isUsed) {
      ret.push(fidilityTraditional);
    }

    const netWorth = sumBy(totalInvestments, "stocks") + total.actual;
    return { netWorth: netWorth, returns: ret, total };
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

type BrokerInvestmentType = {
  broker: string;
  stock: number;
  etf: number;
  mf: number;
  total: number;
};
export type InvestmentByBrokerType = {
  total: BrokerInvestmentType;
  brokers: BrokerInvestmentType[];
};
export async function getInvestmentByBroker(exchange: string, includeBokerage: boolean): Promise<InvestmentByBrokerType | null> {
  try {
    const sequelize = await connectDB();

    const stockSQL = `SELECT broker, sum((qty*price)) AS stocks
                      FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                      WHERE c.exchange = :exchange AND c.sector != 'ETF' GROUP BY broker`;
    const stockSQLWithBrokerage = `SELECT broker, sum((qty*price)+stt+brokerage+otherCharges) AS stocks
                      FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                      WHERE c.exchange = :exchange AND c.sector != 'ETF' GROUP BY broker`;
    const stocks: Array<{ broker; stocks }> = await sequelize.query(includeBokerage ? stockSQLWithBrokerage : stockSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const stockETFSQL = `SELECT broker, sum((qty*price)) AS etf
                      FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                      WHERE c.exchange = :exchange AND c.sector = 'ETF' GROUP BY broker`;
    const stockETFSQLWithBrokerage = `SELECT broker, sum((qty*price)+stt+brokerage+otherCharges) AS etf
                      FROM StockInvestments s JOIN Companies c on s.companyID = c.id
                      WHERE c.exchange = :exchange AND c.sector = 'ETF' GROUP BY broker`;
    const etfs: Array<{ broker; etf; isMerged }> = await sequelize.query(includeBokerage ? stockETFSQLWithBrokerage : stockETFSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const mfSQL = `SELECT  broker, sum((qty*price))  as mutualFunds
                  FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
                  WHERE exchange = :exchange  GROUP BY broker`;
    const mfSQLWithBrokerage = `SELECT  broker, sum((qty*price)+stt+brokerage+otherCharges)  as mutualFunds
                  FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
                  WHERE exchange = :exchange  GROUP BY broker`;
    const mfs: Array<{ broker; mutualFunds; isMerged }> = await sequelize.query(includeBokerage ? mfSQLWithBrokerage : mfSQL, {
      replacements: { exchange: exchange },
      type: QueryTypes.SELECT,
    });

    const ret: BrokerInvestmentType[] = [];

    stocks.forEach(e => {
      const mf = mfs.find(m => m.broker === e.broker);
      const etfIndex = etfs.find(m => e.broker === m.broker);
      const item = {
        broker: e.broker,
        stock: e.stocks,
        etf: 0,
        mf: 0,
        total: e.stocks,
      };
      if (mf) {
        item.mf = mf.mutualFunds;
        item.total += mf.mutualFunds;
        mf.isMerged = true;
      }
      if (etfIndex) {
        item.etf = etfIndex.etf;
        item.total += etfIndex.etf;
        etfIndex.isMerged = true;
      }
      ret.push(item);
    });

    etfs.forEach(e => {
      if (!e.isMerged) {
        const mf = mfs.find(m => m.broker === e.broker);
        const item = {
          broker: e.broker,
          stock: 0,
          etf: e.etf,
          mf: 0,
          total: e.etf,
        };
        if (mf && !mf.isMerged) {
          item.mf = mf.mutualFunds;
          item.total += mf.mutualFunds;
          mf.isMerged = true;
        }

        ret.push(item);
      }
    });

    mfs.forEach(e => {
      if (!e.isMerged) {
        const item = {
          broker: e.broker,
          stock: 0,
          etf: 0,
          mf: e.mutualFunds,
          total: e.mutualFunds,
        };
        ret.push(item);
      }
    });

    const total = {
      broker: "Total",
      stock: 0,
      etf: 0,
      mf: 0,
      total: 0,
    };

    ret.forEach(e => {
      total.stock += e.stock;
      total.etf += e.etf;
      total.mf += e.mf;
      total.total += e.total;
    });

    return { brokers: ret, total };
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

// export class ReportService extends BaseService {
//   constructor() {
//     super();
//   }

//   public async getBrokerInvestmentsWithoutBrokerage(exchange: string): Promise<any> {
//     try {
//       const stockSQL = `SELECT broker, sum(qty*price) AS stocks
//                         FROM StockInvestments s JOIN Companies c on s.companyID = c.id
//                         WHERE c.exchange = :exchange AND c.sector != 'ETF' GROUP BY broker`;
//       const stocks: Array<{ broker; stocks }> = await this.sequelize.query(stockSQL, {
//         replacements: { exchange: exchange },
//         type: QueryTypes.SELECT,
//       });

//       const stockETFSQL = `SELECT broker, sum(qty*price) AS etf
//                         FROM StockInvestments s JOIN Companies c on s.companyID = c.id
//                         WHERE c.exchange = :exchange AND c.sector = 'ETF' GROUP BY broker`;
//       const etfs: Array<{ broker; etf; isMerged }> = await this.sequelize.query(stockETFSQL, {
//         replacements: { exchange: exchange },
//         type: QueryTypes.SELECT,
//       });

//       const mfSQL = `SELECT  broker, sum(qty*price)  as mutualFunds
//                     FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
//                     WHERE exchange = :exchange  GROUP BY broker`;
//       const mfs: Array<{ broker; mutualFunds; isMerged }> = await this.sequelize.query(mfSQL, {
//         replacements: { exchange: exchange },
//         type: QueryTypes.SELECT,
//       });

//       const ret = [];

//       stocks.forEach((e) => {
//         const mf = mfs.find((m) => m.broker === e.broker);
//         const etfIndex = etfs.find((m) => e.broker === m.broker);
//         const item = {
//           broker: e.broker,
//           stock: e.stocks,
//           etf: 0,
//           mf: 0,
//           total: e.stocks,
//         };
//         if (mf) {
//           item.mf = mf.mutualFunds;
//           item.total += mf.mutualFunds;
//           mf.isMerged = true;
//         }
//         if (etfIndex) {
//           item.etf = etfIndex.etf;
//           item.total += etfIndex.etf;
//           etfIndex.isMerged = true;
//         }

//         ret.push(item);
//       });

//       etfs.forEach((e) => {
//         if (!e.isMerged) {
//           const mf = mfs.find((m) => m.broker === e.broker);
//           const item = {
//             broker: e.broker,
//             stock: 0,
//             etf: e.etf,
//             mf: 0,
//             total: e.etf,
//           };
//           if (mf && !mf.isMerged) {
//             item.mf = mf.mutualFunds;
//             item.total += mf.mutualFunds;
//             mf.isMerged = true;
//           }

//           ret.push(item);
//         }
//       });

//       mfs.forEach((e) => {
//         if (!e.isMerged) {
//           const item = {
//             broker: e.broker,
//             stock: 0,
//             etf: 0,
//             mf: e.mutualFunds,
//             total: e.mutualFunds,
//           };
//           ret.push(item);
//         }
//       });

//       const total = {
//         broker: "Total",
//         stock: 0,
//         etf: 0,
//         mf: 0,
//         total: 0,
//       };
//       ret.forEach((e) => {
//         total.stock += e.stock;
//         total.etf += e.etf;
//         total.mf += e.mf;
//         total.total += e.total;
//       });

//       ret.push(total);

//       return ret;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get all monthly INR investments";
//     }
//   }

//   public async getBrokerBalance(exchange: string): Promise<any> {
//     try {
//       const currency = exchange === "NSE" ? "INR" : "USD";
//       const depositsSQL = `SELECT [from], [to], [desc], sum(amount) AS amount FROM Deposits WHERE currency = :currency
//                         GROUP BY [from], [to], [desc]`;
//       const deposits: Array<{ from; to; desc; amount }> = await this.sequelize.query(depositsSQL, {
//         replacements: { currency: currency },
//         type: QueryTypes.SELECT,
//       });

//       let stocksSQL = `SELECT broker, sum((qty*price)+stt+brokerage+otherCharges) AS stocks
//                         FROM StockInvestments s JOIN Companies c on s.companyID = c.id
//                         WHERE c.exchange = :exchange `;
//       if (exchange === "NSE") {
//         stocksSQL += ` AND purchaseDate > '2022-12-01' GROUP BY broker`;
//       } else {
//         stocksSQL += ` GROUP BY broker`;
//       }
//       const stocks: Array<{ broker; stocks }> = await this.sequelize.query(stocksSQL, {
//         replacements: { exchange: exchange },
//         type: QueryTypes.SELECT,
//       });

//       const stocksQtySQL = `SELECT broker, sum(qty) AS qty
//                             FROM StockInvestments s JOIN Companies c on s.companyID = c.id
//                             WHERE c.exchange = :exchange  GROUP BY broker`;
//       const stockQty: Array<{ broker; qty }> = await this.sequelize.query(stocksQtySQL, {
//         replacements: { exchange: exchange },
//         type: QueryTypes.SELECT,
//       });

//       const groww = {
//         broker: "GROWW",
//         balance: 0,
//         stocks: 0,
//         isUsed: false,
//       };

//       const dhann = {
//         broker: "DHAN",
//         balance: 0,
//         stocks: 0,
//         isUsed: false,
//       };

//       const fidilityRoth = {
//         broker: "Fidility Roth",
//         balance: 0,
//         stocks: 0,
//         isUsed: false,
//       };
//       const WEBULL = {
//         broker: "WEBULL",
//         balance: 0,
//         stocks: 0,
//         isUsed: false,
//       };
//       const fidilityTraditional = {
//         broker: "Fidility Traditional",
//         balance: 0,
//         stocks: 0,
//         isUsed: false,
//       };
//       const fidilityIndividual = {
//         broker: "Fidility Individual",
//         balance: 0,
//         stocks: 0,
//         isUsed: false,
//       };
//       const total = {
//         broker: "Total",
//         balance: 0,
//         stocks: 0,
//         isUsed: true,
//       };

//       deposits.forEach((d) => {
//         if (d.from === "Bank" && d.to === "DHAN") {
//           dhann.balance += d.amount;
//           dhann.isUsed = true;
//         } else if (d.from === "Bank" && d.to === "GROWW") {
//           groww.balance += d.amount;
//           groww.isUsed = true;
//         } else if (d.from === "GROWW" && d.to === "Bank") {
//           groww.balance -= d.amount;
//           groww.isUsed = true;
//         } else if (d.from === "DHAN" && d.to === "Bank") {
//           dhann.balance -= d.amount;
//           dhann.isUsed = true;
//         } else if (d.from === "Bank" && d.to === "WEBULL") {
//           WEBULL.balance += d.amount;
//           WEBULL.isUsed = true;
//         } else if (d.from === "WEBULL" && d.to === "Bank") {
//           WEBULL.balance -= d.amount;
//           WEBULL.isUsed = true;
//         } else if (d.from === "WEBULL" && d.to === "WEBULL" && d.desc === "Divident Received") {
//           WEBULL.balance += d.amount;
//           WEBULL.isUsed = true;
//         } else if (d.from === "Bank" && d.to === "Fidility - Roth") {
//           fidilityRoth.balance += d.amount;
//           fidilityRoth.isUsed = true;
//         } else if (d.from === "Fidility - Roth" && d.to === "Fidility - Roth" && d.desc === "Divident Received") {
//           fidilityRoth.balance += d.amount;
//           fidilityRoth.isUsed = true;
//         } else if (d.from === "Bank" && d.to === "Fidility - Traditional") {
//           fidilityTraditional.balance += d.amount;
//           fidilityTraditional.isUsed = true;
//         } else if (d.from === "Fidility - Traditional" && d.to === "Fidility - Traditional" && d.desc === "Divident Received") {
//           fidilityTraditional.balance += d.amount;
//           fidilityTraditional.isUsed = true;
//         } else if (d.from === "Bank" && d.to === "Fidility - Individual") {
//           fidilityIndividual.balance += d.amount;
//           fidilityIndividual.isUsed = true;
//         } else if (d.from === "Fidility - Individual" && d.to === "Fidility - Individual" && d.desc === "Divident Received") {
//           fidilityIndividual.balance += d.amount;
//           fidilityIndividual.isUsed = true;
//         }
//       });

//       stocks.forEach((s) => {
//         if (s.broker === "GROWW") {
//           groww.balance -= s.stocks;
//           groww.isUsed = true;
//         } else if (s.broker === "DHANN") {
//           dhann.balance -= s.stocks;
//           dhann.isUsed = true;
//         } else if (s.broker === "WEBULL") {
//           WEBULL.balance -= s.stocks;
//           WEBULL.isUsed = true;
//         } else if (s.broker === "FidilityRoth") {
//           fidilityRoth.balance -= s.stocks;
//           fidilityRoth.isUsed = true;
//         } else if (s.broker === "FidilityTraditional") {
//           fidilityTraditional.balance -= s.stocks;
//           fidilityTraditional.isUsed = true;
//         } else if (s.broker === "FidilityIndividual") {
//           fidilityIndividual.balance -= s.stocks;
//           fidilityIndividual.isUsed = true;
//         }
//       });

//       stockQty.forEach((s) => {
//         if (s.broker === "GROWW") {
//           groww.stocks = s.qty;
//           groww.isUsed = true;
//         } else if (s.broker === "DHANN") {
//           dhann.stocks = s.qty;
//           dhann.isUsed = true;
//         } else if (s.broker === "WEBULL") {
//           WEBULL.stocks = s.qty;
//           WEBULL.isUsed = true;
//         } else if (s.broker === "FidilityRoth") {
//           fidilityRoth.stocks = s.qty;
//           fidilityRoth.isUsed = true;
//         } else if (s.broker === "FidilityTraditional") {
//           fidilityTraditional.stocks = s.qty;
//           fidilityTraditional.isUsed = true;
//         } else if (s.broker === "FidilityIndividual") {
//           fidilityIndividual.stocks = s.qty;
//           fidilityIndividual.isUsed = true;
//         }
//       });

//       const ret = [];

//       if (groww.isUsed) {
//         ret.push(groww);
//       }
//       if (dhann.isUsed) {
//         ret.push(dhann);
//       }
//       if (WEBULL.isUsed) {
//         ret.push(WEBULL);
//       }
//       if (fidilityRoth.isUsed) {
//         ret.push(fidilityRoth);
//       }
//       if (fidilityTraditional.isUsed) {
//         ret.push(fidilityTraditional);
//       }
//       if (fidilityIndividual.isUsed) {
//         ret.push(fidilityIndividual);
//       }
//       ret.forEach((e) => {
//         total.balance += e.balance;
//         total.stocks += e.stocks;
//       });
//       ret.push(total);

//       return ret;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get data";
//     }
//   }

//   public async getYearlyDividend(exchange: string): Promise<any> {
//     try {
//       const currency = exchange === "NSE" ? "INR" : "USD";
//       const depositSQL = ` SELECT STRFTIME("%Y", [date]) as year, SUM(amount) as amount FROM Deposits WHERE currency = :currency
//                           GROUP BY STRFTIME("%Y", [date]),  [desc]   HAVING [desc] = 'Divident Received' ORDER By [date]`;
//       const dividends: Array<{ year; amount }> = await this.sequelize.query(depositSQL, {
//         replacements: { currency: currency },
//         type: QueryTypes.SELECT,
//       });

//       const sortedDate = _.sortBy(dividends, "year");
//       return sortedDate;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get all monthly INR investments";
//     }
//   }

//   public async getBrokerStatement(broker: string): Promise<any> {
//     try {
//       if (broker === "Fidility Roth") {
//         broker = "Fidility - Roth";
//       } else if (broker === "Fidility Traditional") {
//         broker = "Fidility - Traditional";
//       } else if (broker === "Fidility Individual") {
//         broker = "Fidility - Individual";
//       }
//       const deposits = await Deposit.findAll({
//         where: {
//           [Op.or]: [
//             {
//               from: {
//                 [Op.eq]: broker,
//               },
//             },
//             {
//               to: {
//                 [Op.eq]: broker,
//               },
//             },
//           ],
//         },
//         order: [["date", "DESC"]],
//       });

//       return deposits;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get all monthly INR investments";
//     }
//   }

//   public async getPurchaseDetail(type: string, id: number): Promise<any> {
//     try {
//       let query = ` SELECT STRFTIME("%Y", [date]) as year, SUM(amount) as amount FROM Deposits WHERE currency = :currency
//                           GROUP BY STRFTIME("%Y", [date]),  [desc]   HAVING [desc] = 'Divident Received' ORDER By [date]`;

//       if (type === "stock") {
//         query = `SELECT s.id,  c.name, purchaseDate, qty, price,  currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , ((c.currentPrice * qty)+stt+brokerage+otherCharges) AS currentAmount, currency
//                         FROM StockInvestments s JOIN Companies c on s.companyID = c.id WHERE c.id = :id ORDER BY purchaseDate desc`;
//       } else {
//         query = `SELECT mi.id, mf.name, purchaseDate, qty, price, mf.currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , (mf.currentPrice * qty) AS currentAmount, currency
//                 FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
//                 WHERE mf.id = :id ORDER BY purchaseDate desc`;
//       }

//       const result: Array<{
//         id;
//         name;
//         purchaseDate;
//         qty;
//         price;
//         currentPrice;
//         grossAmount;
//         netAmount;
//         broker;
//         currentAmount;
//         currency;
//         XIRR;
//         CAGR;
//       }> = await this.sequelize.query(query, {
//         replacements: { id: id },
//         type: QueryTypes.SELECT,
//       });

//       let currentPrice = 0;
//       let investedValue = 0;
//       let qty = 0;
//       const totalXIRRData = [];
//       const growthRate = {
//         percentage10: 0,
//         percentage12: 0,
//         percentage15: 0,
//         percentage18: 0,
//         percentage24: 0,
//       };
//       result.forEach((e) => {
//         currentPrice = e.currentPrice;
//         investedValue += e.netAmount;
//         qty += e.qty;
//         const investmentDT = moment(e.purchaseDate, "YYYY-MM-DD");

//         let rate = 0;
//         if (e.netAmount !== 0) {
//           rate = Financial.calculateXIRR([
//             { amount: e.netAmount * -1, when: investmentDT },
//             { amount: e.currentAmount, when: moment() },
//           ]);
//         }

//         totalXIRRData.push({ amount: e.netAmount * -1, when: investmentDT });
//         e.XIRR = rate * 100;
//         e.CAGR = Financial.calculateCAGR(e.purchaseDate, e.price, e.currentPrice);

//         // calculate growth rate
//         const period = Financial.calculatePeriodYear(e.purchaseDate);
//         if (period > 0) {
//           growthRate.percentage10 += Financial.calculateInterest(e.netAmount, 10, period);
//           growthRate.percentage12 += Financial.calculateInterest(e.netAmount, 12, period);
//           growthRate.percentage15 += Financial.calculateInterest(e.netAmount, 15, period);
//           growthRate.percentage18 += Financial.calculateInterest(e.netAmount, 18, period);
//           growthRate.percentage24 += Financial.calculateInterest(e.netAmount, 24, period);
//         } else {
//           let periodDays = Financial.calculatePeriodDays(e.purchaseDate);
//           periodDays = periodDays + 1;
//           growthRate.percentage10 += Financial.calculateSimpleInterest(e.netAmount, periodDays, 10);
//           growthRate.percentage12 += Financial.calculateSimpleInterest(e.netAmount, periodDays, 12);
//           growthRate.percentage15 += Financial.calculateSimpleInterest(e.netAmount, periodDays, 15);
//           growthRate.percentage18 += Financial.calculateSimpleInterest(e.netAmount, periodDays, 18);
//           growthRate.percentage24 += Financial.calculateSimpleInterest(e.netAmount, periodDays, 24);
//         }
//       });
//       totalXIRRData.push({ amount: qty * currentPrice, when: moment() });
//       const returns = qty * currentPrice - investedValue;
//       const avgPrice = investedValue / qty;
//       const totalXIRR = Financial.calculateXIRR(totalXIRRData) * 100;

//       growthRate.percentage10 = _.round(growthRate.percentage10, 2);
//       growthRate.percentage12 = _.round(growthRate.percentage12, 2);
//       growthRate.percentage15 = _.round(growthRate.percentage15, 2);
//       growthRate.percentage18 = _.round(growthRate.percentage18, 2);
//       growthRate.percentage24 = _.round(growthRate.percentage24, 2);

//       return {
//         totalXIRR,
//         currentPrice,
//         investedValue,
//         qty,
//         returns,
//         avgPrice,
//         growthRate,
//         data: result,
//       };

//       // return result;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get purchase detail";
//     }
//   }

//   public async getPurchaseDetailByBroker(broker: string): Promise<any> {
//     try {
//       if (broker === "DHAN") {
//         broker = "DHANN";
//       } else if (broker === "Fidility Roth") {
//         broker = "FidilityRoth";
//       } else if (broker === "Fidility Traditional") {
//         broker = "FidilityTraditional";
//       } else if (broker === "Fidility Individual") {
//         broker = "FidilityIndividual";
//       }
//       const queryStock = `SELECT s.id, c.id as companyID,  c.name, purchaseDate, qty, price,  currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , ((c.currentPrice * qty)+stt+brokerage+otherCharges) AS currentAmount, currency, 'stock' as type
//       FROM StockInvestments s JOIN Companies c on s.companyID = c.id WHERE s.broker = :broker  ORDER BY purchaseDate desc`;

//       const queryMF = `SELECT mi.id, mf.id as companyID, mf.name, purchaseDate, qty, price, mf.currentPrice, (qty*price) as grossAmount, ((qty*price)+stt+brokerage+otherCharges) AS netAmount, broker  , (mf.currentPrice * qty) AS currentAmount, currency, 'mf' as type
//                 FROM MutualFundInvestments mi JOIN MutualFunds mf on mf.id = mi.mutualFundID
//                 WHERE mi.broker = :broker  ORDER BY purchaseDate desc`;

//       let result: Array<{
//         id;
//         companyID;
//         name;
//         purchaseDate;
//         qty;
//         price;
//         currentPrice;
//         grossAmount;
//         netAmount;
//         broker;
//         currentAmount;
//         currency;
//         XIRR;
//         CAGR;
//         type;
//       }> = await this.sequelize.query(queryStock, {
//         replacements: { broker: broker },
//         type: QueryTypes.SELECT,
//       });
//       const resultMF: Array<{
//         id;
//         companyID;
//         name;
//         purchaseDate;
//         qty;
//         price;
//         currentPrice;
//         grossAmount;
//         netAmount;
//         broker;
//         currentAmount;
//         currency;
//         XIRR;
//         CAGR;
//         type;
//       }> = await this.sequelize.query(queryMF, {
//         replacements: { broker: broker },
//         type: QueryTypes.SELECT,
//       });

//       result.push(...resultMF);

//       result = _.orderBy(result, "purchaseDate", "desc");

//       let investedValue = 0;
//       let qty = 0;
//       let totalProfit = 0;
//       result.forEach((e) => {
//         investedValue += e.netAmount;
//         qty += e.qty;
//         const investmentDT = moment(e.purchaseDate, "YYYY-MM-DD");

//         let na = e.netAmount * -1;
//         let rate = 0;
//         if (e.netAmount !== 0) {
//           rate = Financial.calculateXIRR([
//             { amount: na, when: investmentDT },
//             { amount: e.currentAmount, when: moment() },
//           ]);
//         }

//         e.XIRR = rate * 100;
//         e.CAGR = Financial.calculateCAGR(e.purchaseDate, e.price, e.currentPrice);
//         totalProfit += e.currentAmount - e.netAmount;
//       });

//       return { totalProfit, broker, investedValue, data: result };

//       // return result;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get detail";
//     }
//   }

//   public async getTotalSales(exchange: string): Promise<any> {
//     try {
//       const salesSQL = ` SELECT STRFTIME("%Y", [saleDate]) as "year", sum((qty*salePrice)+charges) as "sales" FROM sales
//                           WHERE exchange = :exchange GROUP BY STRFTIME("%Y", [saleDate])`;
//       const result: Array<{
//         year;
//         sales;
//       }> = await this.sequelize.query(salesSQL, {
//         replacements: { exchange: exchange },
//         type: QueryTypes.SELECT,
//       });

//       return { total: _.sumBy(result, "sales"), sales: result };
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get detail";
//     }
//   }
// }
