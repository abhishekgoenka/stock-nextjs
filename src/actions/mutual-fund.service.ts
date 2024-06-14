import MutualFund from "../models/mutual-fund.model";
import { BaseService } from "./base.service";

export class MutualFundService extends BaseService {
  public async getMFs(): Promise<any> {
    try {
      await this.connectDB();
      const mfs = await MutualFund.findAll();
      return mfs;
    } catch (ex) {
      console.error(ex);
      throw "Failed to get all mutual funds";
    }
  }

  public async getMFByID(id: string): Promise<any> {
    try {
      const mfs = await MutualFund.findByPk(id);
      return mfs;
    } catch (ex) {
      console.error(ex);
      throw "Failed to get mutual fund";
    }
  }

  public async updateMF(
    id: number,
    name: string,
    equity: number,
    debt: number,
    others: number,
    largeCap: number,
    midCap: number,
    smallCap: number,
    otherCap: number,
    url: string,
    exchange: string,
    indexFund: boolean,
    symbol: string,
    currentPrice: number,
  ): Promise<[affectedCount: number]> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();
      const record = await MutualFund.update(
        {
          name,
          equity,
          debt,
          others,
          largeCap,
          midCap,
          smallCap,
          otherCap,
          url,
          exchange,
          indexFund,
          currentPrice,
          symbol,
        },
        {
          where: { id: id },
          transaction,
        },
      );
      await transaction.commit();
      return record;
    } catch (ex) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error(ex);
      throw "Failed to update MF";
    }
  }

  // public async addMF(
  //   name: string,
  //   equity: number,
  //   debt: number,
  //   others: number,
  //   largeCap: number,
  //   midCap: number,
  //   smallCap: number,
  //   otherCap: number,
  //   url: string,
  //   exchange: string,
  //   indexFund: boolean,
  //   symbol: string,
  // ): Promise<MutualFund> {
  //   let transaction;
  //   try {
  //     transaction = await this.sequelize.transaction();
  //     const record = await MutualFund.create(
  //       {
  //         name,
  //         equity,
  //         debt,
  //         others,
  //         largeCap,
  //         midCap,
  //         smallCap,
  //         otherCap,
  //         url,
  //         exchange,
  //         indexFund,
  //         symbol,
  //       },
  //       { transaction }
  //     );
  //     await transaction.commit();
  //     return record;
  //   } catch (ex) {
  //     if (transaction) {
  //       await transaction.rollback();
  //     }
  //     console.error(ex);
  //     throw "Failed to add MF";
  //   }
  // }

  public async deleteMF(id: number): Promise<number> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();
      const record = await MutualFund.destroy({
        where: { id },
        transaction,
      });
      await transaction.commit();
      return record;
    } catch (ex) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error(ex);
      throw "Failed to delete mutual fund";
    }
  }
}
