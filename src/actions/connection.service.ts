import { Sequelize } from "sequelize-typescript";
import Company from "@/models/company.model";
import StockInvestment from "@/models/stock-investment.model";

export class ConnectionService {
  static sequelize: Sequelize;

  private constructor() {}

  static async generateConnection() {
    try {
      ConnectionService.sequelize = new Sequelize({
        logging: true,
        dialect: "sqlite",
        storage: "portfolio.sqlite",
        models: [Company, StockInvestment],
      });
      await ConnectionService.sequelize.authenticate();
    } catch (ex) {
      console.error(ex);
    }
  }
}
