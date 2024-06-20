import { StockInvestmentType } from "@/models/stock-investment.model";
import MutualFundInvestment, { MutualFundInvestmentType } from "../models/mutual-fund-investment.model";
import MutualFund from "../models/mutual-fund.model";
import { BaseService, connectDB } from "./base.service";

export async function getMutualFundInvestments(): Promise<MutualFundInvestmentType[]> {
  await connectDB();
  return await MutualFundInvestment.findAll({ include: MutualFund });
}

// export class MutualFundInvestmentService extends BaseService {
//   constructor() {
//     super();
//   }

//   public async getMutualFundInvestmentByID(id: string): Promise<any> {
//     try {
//       const mi = await MutualFundInvestment.findByPk(id);
//       return mi;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get mutual fund investment";
//     }
//   }

//   public async updateMutualFundInvestment(
//     id: number,
//     mutualFundID: number,
//     purchaseDate: string,
//     qty: number,
//     price: number,
//     stt: number,
//     brokerage: number,
//     otherCharges: number,
//     currency: string,
//     broker: string
//   ): Promise<[affectedCount: number]> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       const record = await MutualFundInvestment.update(
//         {
//           mutualFundID,
//           purchaseDate,
//           qty,
//           price,
//           stt,
//           brokerage,
//           otherCharges,
//           currency,
//           broker
//         },
//         {
//           where: { id: id },
//           transaction
//         }
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

//   public async addMutualFundInvestment(
//     mutualFundID: number,
//     purchaseDate: string,
//     qty: number,
//     price: number,
//     stt: number,
//     brokerage: number,
//     otherCharges: number,
//     currency: string,
//     broker: string
//   ): Promise<MutualFundInvestment> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       const record = await MutualFundInvestment.create(
//         {
//           mutualFundID,
//           purchaseDate,
//           qty,
//           price,
//           stt,
//           brokerage,
//           otherCharges,
//           currency,
//           broker
//         },
//         { transaction }
//       );
//       await transaction.commit();
//       return record;
//     } catch (ex) {
//       if (transaction) {
//         await transaction.rollback();
//       }
//       console.error(ex);
//       throw "Failed to add mutual fund investment";
//     }
//   }

//   public async deleteMutualFundInvestment(id: number): Promise<number> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       const record = await MutualFundInvestment.destroy({
//         where: { id },
//         transaction
//       });
//       await transaction.commit();
//       return record;
//     } catch (ex) {
//       if (transaction) {
//         await transaction.rollback();
//       }
//       console.error(ex);
//       throw "Failed to delete mutual fund investment";
//     }
//   }
// }
