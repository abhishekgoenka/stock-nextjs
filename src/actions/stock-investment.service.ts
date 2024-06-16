"use server";

import Company from "../models/company.model";
import StockInvestment, { StockInvestmentType } from "../models/stock-investment.model";
import { connectDB } from "./base.service";

export async function getStockInvestments(): Promise<StockInvestmentType[]> {
  await connectDB();
  return await StockInvestment.findAll({ include: Company });
}

export async function addStockInvestment(investment: StockInvestmentType): Promise<StockInvestmentType> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record: StockInvestmentType = await StockInvestment.create(investment, { transaction });
    await transaction.commit();
    return JSON.parse(JSON.stringify(record));
  } catch (ex) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error(ex);
    throw "Failed to add stock investment";
  }
}

// export class StockInvestmentService extends BaseService {
//   constructor() {
//     super();
//   }

//   // public async getStockInvestments(): Promise<any> {
//   //   try {
//   //     const si = await StockInvestment.findAll({ include: Company });
//   //     return si;
//   //   } catch (ex) {
//   //     console.error(ex);
//   //     throw "Failed to get all stock investments";
//   //   }
//   // }

//   public async getStockInvestmentByID(
//     id: string,
//   ): Promise<StockInvestment | null> {
//     try {
//       const si = await StockInvestment.findByPk(id);
//       return si;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get stock investment";
//     }
//   }

//   public async updateStockInvestment(
//     id: number,
//     companyID: number,
//     purchaseDate: string,
//     qty: number,
//     price: number,
//     stt: number,
//     brokerage: number,
//     otherCharges: number,
//     currency: string,
//     broker: string,
//   ): Promise<[affectedCount: number]> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       const record = await StockInvestment.update(
//         {
//           companyID,
//           purchaseDate,
//           qty,
//           price,
//           stt,
//           brokerage,
//           otherCharges,
//           currency,
//           broker,
//         },
//         {
//           where: { id: id },
//           transaction,
//         },
//       );
//       await transaction.commit();
//       return record;
//     } catch (ex) {
//       if (transaction) {
//         await transaction.rollback();
//       }
//       console.error(ex);
//       throw "Failed to update MF";
//     }
//   }

//   // public async addStockInvestment(
//   //   companyID: number,
//   //   purchaseDate: string,
//   //   qty: number,
//   //   price: number,
//   //   stt: number,
//   //   brokerage: number,
//   //   otherCharges: number,
//   //   currency: string,
//   //   broker: string
//   // ): Promise<StockInvestment> {
//   //   let transaction;
//   //   try {
//   //     transaction = await this.sequelize.transaction();
//   //     const record = await StockInvestment.create(
//   //       {
//   //         companyID,
//   //         purchaseDate,
//   //         qty,
//   //         price,
//   //         stt,
//   //         brokerage,
//   //         otherCharges,
//   //         currency,
//   //         broker
//   //       },
//   //       { transaction }
//   //     );
//   //     await transaction.commit();
//   //     return record;
//   //   } catch (ex) {
//   //     if (transaction) {
//   //       await transaction.rollback();
//   //     }
//   //     console.error(ex);
//   //     throw "Failed to add stock investment";
//   //   }
//   // }

//   public async deleteStockInvestment(id: number): Promise<number> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       const record = await StockInvestment.destroy({
//         where: { id },
//         transaction,
//       });
//       await transaction.commit();
//       return record;
//     } catch (ex) {
//       if (transaction) {
//         await transaction.rollback();
//       }
//       console.error(ex);
//       throw "Failed to add stock investment";
//     }
//   }
// }
