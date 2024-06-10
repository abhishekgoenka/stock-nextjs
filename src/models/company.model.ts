import {
  Model,
  Column,
  Table,
  BelongsToMany,
  Scopes,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import StockInvestment from "./stock-investment.model";

// @Scopes(() => ({
//   roles: {
//     include: [
//       {
//         model: Role,
//         through: { attributes: [] },
//       },
//     ],
//   },
// }))

@Table
export default class Company extends Model<Company> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  sector!: string;

  @Column
  url!: string;

  @Column
  type!: string;

  @Column
  exchange!: string;

  @Column
  symbol!: string;

  @Column
  currentPrice!: number;

  @HasMany(() => StockInvestment)
  stocks: StockInvestment[];
}
