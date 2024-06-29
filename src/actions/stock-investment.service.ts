"use server";

import Company from "../models/company.model";
import StockInvestment, { StockInvestmentType } from "../models/stock-investment.model";
import { connectDB } from "./base.service";

export async function getStockInvestments(): Promise<StockInvestmentType[]> {
  await connectDB();
  return await StockInvestment.findAll({ include: Company });
}

export async function getStockInvestmentByID(id: string): Promise<StockInvestmentType | null> {
  await connectDB();
  return await StockInvestment.findByPk(id, {
    include: [
      {
        model: Company,
        required: true,
      },
    ],
  });
}

export async function addStockInvestment(investment: StockInvestmentType): Promise<StockInvestmentType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record: StockInvestmentType = await StockInvestment.create(investment, { transaction });
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

export async function updateStockInvestment(investment: StockInvestmentType): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await StockInvestment.update(investment, {
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

export async function deleteStockInvestment(id: number): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await StockInvestment.destroy({
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
