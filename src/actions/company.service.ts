"use server";

import Company, { CompanyType } from "@/models/company.model";
import { connectDB } from "./base.service";

export async function getCompanies(): Promise<CompanyType[]> {
  await connectDB();
  const result = await Company.findAll({
    order: [["name", "ASC"]],
  });
  return JSON.parse(JSON.stringify(result));
}

export async function getCompanyByID(id: string): Promise<CompanyType | null> {
  await connectDB();
  return await Company.findByPk(id);
}

export async function addCompany(company: CompanyType): Promise<CompanyType | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Company.create(company, { transaction });
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

export async function updateCompany(company: CompanyType): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Company.update(company, {
      where: { id: company.id },
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

export async function deleteCompany(id: number): Promise<number | null> {
  let transaction;
  try {
    const sequelize = await connectDB();
    transaction = await sequelize.transaction();
    const record = await Company.destroy({ where: { id }, transaction });
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
