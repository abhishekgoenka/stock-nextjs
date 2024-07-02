"use server";

import AnualReturn, { AnnualReturnType } from "@/models/annual-return.model";
import { connectDB } from "./base.service";

export async function getAnnualReturn(exchange: string): Promise<AnnualReturnType[]> {
  await connectDB();
  const result = await AnualReturn.findAll({
    where: {
      exchange,
    },
    order: [["year", "ASC"]],
  });
  return JSON.parse(JSON.stringify(result));
}

export async function getAnnualReturnByID(id: number): Promise<AnnualReturnType | null> {
  await connectDB();
  return await AnualReturn.findByPk(id);
}

export async function addAnnualReturn(annualReturn: AnnualReturnType): Promise<AnnualReturnType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await AnualReturn.create(annualReturn, { transaction });
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

export async function updateAnnualReturn(annualReturn: AnnualReturnType): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await AnualReturn.update(annualReturn, {
      where: { id: annualReturn.id },
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
