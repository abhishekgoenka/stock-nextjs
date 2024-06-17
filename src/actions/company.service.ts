"use server";

import Company, { CompanyType } from "@/models/company.model";
import { BaseService, connectDB } from "./base.service";

export async function getCompanies(): Promise<CompanyType[]> {
  await connectDB();
  const result = await Company.findAll({
    order: [["name", "ASC"]],
  });
  return JSON.parse(JSON.stringify(result));
}

// export class CompanyService extends BaseService {
//   // public async getCompanies(): Promise<Company[]> {
//   //   try {
//   //     await this.connectDB();
//   //     const companies = await Company.findAll({
//   //       order: [["name", "ASC"]],
//   //     });
//   //     return companies;
//   //   } catch (ex) {
//   //     console.error(ex);
//   //     throw "Failed to get all companies";
//   //   }
//   // }

//   public async getCompanyByID(id: string): Promise<any> {
//     try {
//       const c = await Company.findByPk(id);
//       return c;
//     } catch (ex) {
//       console.error(ex);
//       throw "Failed to get company";
//     }
//   }

//   public async updateCompany(
//     id: number,
//     name: string,
//     sector: string,
//     url: string,
//     type: string,
//     exchange: string,
//     symbol: string,
//     currentPrice: number,
//   ): Promise<[affectedCount: number]> {
//     let transaction;
//     try {
//       transaction = await this.sequelize.transaction();
//       const record = await Company.update(
//         {
//           name,
//           sector,
//           url,
//           type,
//           exchange,
//           symbol,
//           currentPrice,
//         },
//         {
//           where: { id: id },
//           transaction,
//         },
//       );
//       await transaction.commit();
//       return record;
//     } catch (ex) {
//       if (transaction) {
//         await transaction.rollback();
//       }
//       console.error(ex);
//       throw "Failed to update company";
//     }
//   }

//   // public async addCompany(
//   //   name: string,
//   //   sector: string,
//   //   url: string,
//   //   type: string,
//   //   exchange: string,
//   //   symbol: string,
//   // ): Promise<Company> {
//   //   let transaction;
//   //   try {
//   //     transaction = await this.sequelize.transaction();
//   //     const record = await Company.create(
//   //       { name, sector, url, type, exchange, symbol },
//   //       { transaction },
//   //     );
//   //     await transaction.commit();
//   //     return record;
//   //   } catch (ex) {
//   //     if (transaction) {
//   //       await transaction.rollback();
//   //     }
//   //     console.error(ex);
//   //     throw 'Failed to add company';
//   //   }
//   // }

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
