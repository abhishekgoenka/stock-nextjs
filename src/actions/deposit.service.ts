"use server";

import Deposit, { DepositType } from "../models/deposit.model";
import { connectDB } from "./base.service";

export async function getDeposits(): Promise<DepositType[]> {
  await connectDB();
  const result = await Deposit.findAll({
    order: [["date", "desc"]],
  });
  return JSON.parse(JSON.stringify(result));
}

export async function getDepositByID(id: string): Promise<DepositType | null> {
  await connectDB();
  return await Deposit.findByPk(id);
}

export async function addDeposit(deposit: DepositType): Promise<DepositType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Deposit.create(deposit, { transaction });
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

export async function updateDeposit(deposit: DepositType): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Deposit.update(deposit, {
      where: { id: deposit.id },
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

export async function deleteDeposit(id: number): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Deposit.destroy({
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
