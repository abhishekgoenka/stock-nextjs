import { Sequelize } from "sequelize-typescript";
import Company from "@/models/company.model";
import StockInvestment from "@/models/stock-investment.model";
import MutualFundInvestment from "@/models/mutual-fund-investment.model";
import MutualFund from "@/models/mutual-fund.model";
import Deposit from "@/models/deposit.model";
import Sale from "@/models/sale.model";

export class ConnectionService {
  static sequelize: Sequelize;

  private constructor() {}

  static async generateConnection() {
    try {
      ConnectionService.sequelize = new Sequelize({
        logging: false,
        dialect: "sqlite",
        storage: "portfolio.sqlite",
        models: [Company, StockInvestment, MutualFund, MutualFundInvestment, Deposit, Sale],
      });
      await ConnectionService.sequelize.authenticate();
    } catch (ex) {
      console.error(ex);
    }
  }
}
