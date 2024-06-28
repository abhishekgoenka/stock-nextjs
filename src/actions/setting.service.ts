"use server";

// import { QueryTypes } from "sequelize";
// import { BaseService } from "./base.service";
// import * as _ from "lodash";
// import axios from "axios";
import { NseIndia } from "stock-nse-india";
import { EquityDetails } from "stock-nse-india/build/interface";
// import Company from "../models/company.model";
// import { CompanyService } from "./company.service";
// import MutualFund from "../models/mutual-fund.model";
// import { MutualFundService } from "./mutual-fund.service";
// import yahooFinance from "yahoo-finance2";
// import { Logger } from "../helpers/logger";

export async function syncStockPrice(symbol: string): Promise<EquityDetails> {
  const nseIndia = new NseIndia();
  return await nseIndia.getEquityDetails(symbol);

  // try {
  //   const nseIndia = new NseIndia();
  //   // const dbService = new CompanyService();
  //   // const dbServiceMF = new MutualFundService();
  //   // const companies = await Company.findAll({
  //   //   order: [["name", "ASC"]],
  //   // });
  //   // const mfs = await MutualFund.findAll({
  //   //   where: {
  //   //     exchange: "NSE",
  //   //   },
  //   // });

  //   return await nseIndia.getEquityDetails(symbol);

  //   const ret = {
  //     result: true,
  //     err: "",
  //   };

  //   for (const company of companies) {
  //     // console.log(company.symbol);
  //     if (company.symbol && company.exchange === "NSE") {
  //       const result = await nseIndia.getEquityDetails(company.symbol);
  //       if (result?.priceInfo?.close === 0) {
  //         const msg = `${company.symbol} close price is zero. Try after some time`;
  //         ret.result = false;
  //         ret.err += msg + "\r\n";
  //         logger.warn(msg);
  //       } else {
  //         logger.debug(`${company.symbol}: ${result?.priceInfo?.close}`)
  //         await dbService.updateCompany(company.id, company.name, company.sector, company.url, company.type, company.exchange, company.symbol, result?.priceInfo?.close);
  //       }
  //     }
  //   }

  //   // https://www.mfapi.in/
  //   for (const mf of mfs) {
  //     if (mf.symbol) {
  //       const url = `https://api.mfapi.in/mf/${mf.symbol}/latest`;
  //       const result = await axios.get(url);
  //       if (result.data && result.data.status === "SUCCESS") {
  //         const nav = result.data.data[0].nav;
  //         logger.debug(`${mf.name}: ${nav}`)
  //         await dbServiceMF.updateMF(mf.id, mf.name, mf.equity, mf.debt, mf.others, mf.largeCap, mf.midCap, mf.smallCap, mf.otherCap, mf.url, mf.exchange, mf.indexFund, mf.symbol, nav);
  //       }
  //     }
  //   }
  //   return ret;
  // } catch (ex) {
  //   console.error(ex);
  //   throw "Failed to get all investment by marketCap";
  // }
}

// const logger = Logger.getLogger('setting');
// export class SettingService extends BaseService {
//   constructor() {
//     super();
//   }

//   public async syncStockPrice(): Promise<any> {
//     try {
//       const nseIndia = new NseIndia();
//       const dbService = new CompanyService();
//       const dbServiceMF = new MutualFundService();
//       const companies = await Company.findAll({
//         order: [["name", "ASC"]],
//       });
//       const mfs = await MutualFund.findAll({
//         where: {
//           exchange: "NSE",
//         },
//       });

//       const ret = {
//         result: true,
//         err: "",
//       };

//       for (const company of companies) {
//         // console.log(company.symbol);
//         if (company.symbol && company.exchange === "NSE") {
//           const result = await nseIndia.getEquityDetails(company.symbol);
//           if (result?.priceInfo?.close === 0) {
//             const msg = `${company.symbol} close price is zero. Try after some time`;
//             ret.result = false;
//             ret.err += msg + "\r\n";
//             logger.warn(msg);
//           } else {
//             logger.debug(`${company.symbol}: ${result?.priceInfo?.close}`)
//             await dbService.updateCompany(company.id, company.name, company.sector, company.url, company.type, company.exchange, company.symbol, result?.priceInfo?.close);
//           }
//         }
//       }

//       // https://www.mfapi.in/
//       for (const mf of mfs) {
//         if (mf.symbol) {
//           const url = `https://api.mfapi.in/mf/${mf.symbol}/latest`;
//           const result = await axios.get(url);
//           if (result.data && result.data.status === "SUCCESS") {
//             const nav = result.data.data[0].nav;
//             logger.debug(`${mf.name}: ${nav}`)
//             await dbServiceMF.updateMF(mf.id, mf.name, mf.equity, mf.debt, mf.others, mf.largeCap, mf.midCap, mf.smallCap, mf.otherCap, mf.url, mf.exchange, mf.indexFund, mf.symbol, nav);
//           }
//         }
//       }
//       return ret;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get all investment by marketCap";
//     }
//   }

//   public async syncMFPrice(): Promise<any> {
//     try {
//       const dbServiceMF = new MutualFundService();
//       const mfs = await MutualFund.findAll({
//         where: {
//           exchange: "NSE",
//         },
//       });

//       const ret = {
//         result: true,
//         err: "",
//       };

//       // https://www.mfapi.in/
//       for (const mf of mfs) {
//         if (mf.symbol) {
//           const url = `https://api.mfapi.in/mf/${mf.symbol}`;
//           const result = await axios.get(url);
//           if (result.data && result.data.status === "SUCCESS") {
//             const nav = result.data.data[0].nav;
//             logger.debug(`${mf.name}: ${nav}`)
//             await dbServiceMF.updateMF(mf.id, mf.name, mf.equity, mf.debt, mf.others, mf.largeCap, mf.midCap, mf.smallCap, mf.otherCap, mf.url, mf.exchange, mf.indexFund, mf.symbol, nav);
//           }
//         }
//       }
//       return ret;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get all investment by marketCap";
//     }
//   }

//   public async syncStockPriceUSA(): Promise<object> {
//     try {
//       const dbService = new CompanyService();
//       const companies = await Company.findAll({
//         order: [["name", "ASC"]],
//       });

//       const ret = {
//         result: true,
//         err: "",
//       };

//       for (const company of companies) {
//         if (company.symbol && company.exchange === "NASDAQ") {
//           const quote = await yahooFinance.quoteSummary(company.symbol);
//           console.log(`${company.symbol} : ${quote.price.regularMarketPrice}`);
//           await dbService.updateCompany(company.id, company.name, company.sector, company.url, company.type, company.exchange, company.symbol, quote.price.regularMarketPrice);
//         }
//       }
//       return ret;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get all investment by marketCap";
//     }
//   }

//   // private
// }
