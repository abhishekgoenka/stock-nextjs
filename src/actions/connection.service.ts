import fs from "fs";
import { Sequelize } from "sequelize-typescript";

import AnnualReturn from "@/models/annual-return.model";
import Company from "@/models/company.model";
import Deposit from "@/models/deposit.model";
import MutualFund from "@/models/mutual-fund.model";
import MutualFundInvestment from "@/models/mutual-fund-investment.model";
import Sale from "@/models/sale.model";
import StockInvestment from "@/models/stock-investment.model";

export class ConnectionService {
  static sequelize: Sequelize;

  private constructor() {}

  static async generateConnection() {
    try {
      const dbPath = process.env.SQLITE_DB_PATH ?? "";
      console.log(`Connecting to SQLite database at ${dbPath}`);
      if (!fs.existsSync(dbPath)) {
        console.error("Database file not found at:", dbPath);
      } else {
        console.log("Database file found at:", dbPath);
      }
      ConnectionService.sequelize = new Sequelize({
        logging: false,
        dialect: "sqlite",
        storage: dbPath,
        models: [Company, StockInvestment, MutualFund, MutualFundInvestment, Deposit, Sale, AnnualReturn],
      });
      await ConnectionService.sequelize.authenticate();
    } catch (ex) {
      console.error(ex);
    }
  }
}
