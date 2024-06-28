"use server";

import MutualFund, { MutualFundType } from "../models/mutual-fund.model";
import { connectDB } from "./base.service";

export async function getMFs(): Promise<MutualFundType[]> {
  await connectDB();
  const result = await MutualFund.findAll();
  return JSON.parse(JSON.stringify(result));
}

export async function getMFByID(id: string): Promise<MutualFundType | null> {
  await connectDB();
  return await MutualFund.findByPk(id);
}

export async function addMF(mutualFund: MutualFundType): Promise<MutualFundType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await MutualFund.create(mutualFund, { transaction });
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

export async function updateMF(mutualFund: MutualFundType): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await MutualFund.update(mutualFund, {
      where: { id: mutualFund.id },
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

export async function deleteMF(id: number): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
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
    return null;
  }
}
