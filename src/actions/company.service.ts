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
    console.log(company);
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

// export class CompanyService extends BaseService {

//   public async delete(id: string): Promise<any> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       await Company.destroy({ where: { id }, transaction });
//       await transaction.commit();
//     } catch (ex) {
//       if (transaction) {
//         await transaction.rollback();
//       }
//       console.error(ex);
//       throw "Failed to delete contact";
//     }
//   }
//   // public async setContact(id: string, picture: string, name: string, roles: any, isActive: boolean, telephone: string): Promise<any> {
//   //     let transaction
//   //     try {
//   //         transaction = await this.sequelize.transaction()
//   //         await User.update({ picture: picture, name: name, isActive: isActive, telephone: telephone }, { where: { name: name }, transaction })
//   //         await UsersRoles.destroy({ where: { userID: id }, transaction })
//   //         await this.handleRoles(id, roles, transaction)
//   //         await transaction.commit();

//   //     } catch (ex) {
//   //         if (transaction) {
//   //             await transaction.rollback();
//   //         }
//   //         console.error(ex)
//   //         throw 'Failed to set contact'
//   //     }

//   // }

//   // private async handleRoles(id, roles, transaction): Promise<void> {
//   //     try {
//   //         const UserRoleObj = [];
//   //         for (const role of roles) {
//   //             const existRole = await Role.findOne({ where: { role: role.role } })
//   //             if (existRole) {
//   //                 UserRoleObj.push({ userID: id, role: existRole.role })
//   //             }
//   //             else {
//   //                 await Role.create({ role: role.role }, { transaction })
//   //                 UserRoleObj.push({ userID: id, role: role.role })
//   //             }
//   //         }

//   //         await UsersRoles.bulkCreate(UserRoleObj, { transaction });

//   //     } catch (ex) {
//   //         throw ex
//   //     }
//   // }
// }
