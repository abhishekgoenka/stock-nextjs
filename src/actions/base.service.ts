import { Sequelize } from "sequelize-typescript";

import { ConnectionService } from "./connection.service";

export class BaseService {
  protected sequelize: Sequelize;

  protected async connectDB() {
    if (!ConnectionService.sequelize) {
      await ConnectionService.generateConnection();
    }
    this.sequelize = ConnectionService.sequelize;
  }
}
