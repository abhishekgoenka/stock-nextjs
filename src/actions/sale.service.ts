"use server";

import { StockOrMutualFundType } from "@/lib/constants";
import StockInvestment from "@/models/stock-investment.model";

import Sale, { SaleType } from "../models/sale.model";
import { connectDB } from "./base.service";
import { deleteMutualFundInvestment } from "./mutual-fund-investment.service";
import { getStockInvestmentByID } from "./stock-investment.service";

export async function addSales(sale: SaleType, type: StockOrMutualFundType, investmentID: number): Promise<SaleType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Sale.create(sale, { transaction });

    if (type === "stock") {
      const currentInvestment = await getStockInvestmentByID(investmentID.toString());
      if (currentInvestment) {
        if (currentInvestment.qty === sale.qty) {
          await StockInvestment.destroy({
            where: { id: currentInvestment.id },
            transaction,
          });
        } else {
          currentInvestment.qty -= sale.qty;
          await StockInvestment.update(currentInvestment, {
            where: { id: currentInvestment.id },
            transaction,
          });
        }
      }
    } else {
      await deleteMutualFundInvestment(investmentID);
    }
    await transaction.commit();
    return JSON.parse(JSON.stringify(record));
  } catch (ex) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error(ex);
    return null;
  }
}

// export class SaleService {
//   private sequelize: Sequelize;
//   static dbInstance;

//   constructor() {
//     if (SaleService.dbInstance) {
//       return SaleService.dbInstance;
//     }

//     SaleService.dbInstance = this;
//     this.sequelize = ConnectionService.sequelize;
//   }

//   public async getCompanyDetail(id: number, type: string): Promise<object> {
//     const ret: {
//       company?: string;
//       purchaseDate?: string;
//       purchasePrice?: number;
//       qty?: number;
//       exchange?: string;
//       broker?: string;
//       currency?: string;
//       companyID?: number;
//     } = {};
//     if (type === "stock") {
//       const stock = await StockInvestment.findByPk(id, {
//         include: [
//           {
//             model: Company,
//             required: true,
//           },
//         ],
//       });
//       ret.company = stock.company.name;
//       ret.purchaseDate = stock.purchaseDate;
//       ret.purchasePrice = stock.price;
//       ret.qty = stock.qty;
//       ret.exchange = stock.company.exchange;
//       ret.broker = stock.broker;
//       ret.currency = stock.currency;
//       ret.companyID = stock.company.id;
//     } else {
//       const stock = await MutualFundInvestment.findByPk(id, {
//         include: [
//           {
//             model: MutualFund,
//             required: true,
//           },
//         ],
//       });
//       ret.company = stock.mutualFund.name;
//       ret.purchaseDate = stock.purchaseDate;
//       ret.purchasePrice = stock.price;
//       ret.qty = stock.qty;
//       ret.exchange = stock.mutualFund.exchange;
//       ret.broker = stock.broker;
//       ret.currency = stock.currency;
//       ret.companyID = stock.mutualFund.id;
//     }
//     return ret;
//   }

//   public async getSalesDetailByYear(year: number): Promise<any> {
//     try {
//       const startedDate = new Date(year, 0, 1);
//       const endDate = new Date(year, 11, 31);
//       const sales = await Sale.findAll({ where: { saleDate: { [Op.between]: [startedDate, endDate] } } });
//       let totalSales = 0;
//       let totalPL = 0;
//       const data = sales.map((e) => {
//         return {...e.dataValues, pl: (e.salePrice - e.purchasePrice) * e.qty}
//       });
//       data.forEach((e) => {
//         totalSales += e.qty * e.salePrice;
//         totalPL += e.pl;
//       });
//       return { totalSales, totalPL, data };
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get sales";
//     }
//   }
// }
