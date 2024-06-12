import { Sequelize } from "sequelize-typescript";

import { ConnectionService } from "./connection.service";

export class BaseService {
  protected sequelize: Sequelize;

  protected async connectDB() {
    console.log("connectDB started...");
    if (!ConnectionService.sequelize) {
      console.log("connectDB inprogress...");
      await ConnectionService.generateConnection();
    }
    this.sequelize = ConnectionService.sequelize;
    console.log("connectDB end...");
  }
}
