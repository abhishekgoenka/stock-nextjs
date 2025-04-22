"use server";

import MutualFund from "../models/mutual-fund.model";
import MutualFundInvestment, { MutualFundInvestmentType } from "../models/mutual-fund-investment.model";
import { connectDB } from "./base.service";

export async function getMutualFundInvestments(): Promise<MutualFundInvestment[]> {
  await connectDB();
  return await MutualFundInvestment.findAll({ include: MutualFund });
}

export async function getMutualFundInvestmentByID(id: string): Promise<MutualFundInvestmentType | null> {
  await connectDB();
  const record = await MutualFundInvestment.findByPk(id);
  return record ? JSON.parse(JSON.stringify(record)) : null;
}

export async function addMutualFundInvestment(investment: MutualFundInvestmentType): Promise<MutualFundInvestmentType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await MutualFundInvestment.create(investment, { transaction });
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

export async function updateMutualFundInvestment(investment: MutualFundInvestmentType): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await MutualFundInvestment.update(investment, {
      where: { id: investment.id },
      transaction,
    });
    await transaction.commit();
    return record[0];
  } catch (ex) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error(ex);
    return null;
  }
}

export async function deleteMutualFundInvestment(id: number): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await MutualFundInvestment.destroy({
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
    return null;
  }
}

// export class MutualFundInvestmentService extends BaseService {
//   constructor() {
//     super();
//   }

// }
