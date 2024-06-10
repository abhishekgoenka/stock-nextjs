import { Sequelize } from "sequelize-typescript";
import * as path from "path";

export class ConnectionService {
  static sequelizeInstance: typeof ConnectionService;
  static sequelize: Sequelize;

  private constructor() {}

  static generateConnection() {
    if (ConnectionService.sequelizeInstance) {
      return ConnectionService.sequelizeInstance;
    }
    ConnectionService.sequelizeInstance = this;
    console.log("generateConnection");
    try {
      this.sequelize = new Sequelize({
        logging: false,
        dialect: "sqlite",
        storage: "portfolio.sqlite",
        models: [path.join(__dirname, "..", "models")],
      });

      // await this.sequelize.sync({ force: true });
    } catch (ex) {
      console.error(ex);
    }
  }
}
