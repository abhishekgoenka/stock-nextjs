"use server";

import AnualReturn, { AnnualReturnType } from "@/models/annual-return.model";
import { connectDB } from "./base.service";
import { EXCHANGE_TYPE } from "@/lib/constants";
import { getYear } from "date-fns";
import { QueryTypes } from "sequelize";

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

export async function updateCurrentYearReturn(exchange: EXCHANGE_TYPE) {
  const year = getYear(new Date()).toString();
  console.log("Year", year);

  console.log("exchange", exchange);

  const sequelize = await connectDB();
  const mfSQL = `SELECT sum((qty * price) + stt + brokerage + otherCharges) AS mutualFund
                  FROM MutualFundInvestments mi
                  JOIN MutualFunds mf on mf.id = mi.mutualFundID
                  WHERE exchange = :exchange AND STRFTIME("%Y", purchaseDate) = :year `;
  const mutualFunds: { mutualFund: string }[] = await sequelize.query(mfSQL, {
    replacements: { exchange: exchange, year: year },
    type: QueryTypes.SELECT,
  });

  const stockSQL = `SELECT sum((qty * price) + stt + brokerage + otherCharges) AS stock
                    FROM StockInvestments s
                      JOIN Companies c on s.companyID = c.id
                    WHERE c.exchange = :exchange
                      AND STRFTIME("%Y", purchaseDate) = :year `;
  const stocks: { stock: string }[] = await sequelize.query(stockSQL, {
    replacements: { exchange: exchange, year: year },
    type: QueryTypes.SELECT,
  });

  const investments = mutualFunds[0].mutualFund + stocks[0].stock;
  console.log("investments", investments);
}
