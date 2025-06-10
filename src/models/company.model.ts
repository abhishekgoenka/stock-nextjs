import { AutoIncrement, Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

import StockInvestment from "./stock-investment.model";

export type CompanyType = {
  id?: number;
  name: string;
  sector: string;
  url: string;
  type: string;
  exchange: string;
  symbol: string;
  currentPrice: number;
};

@Table({
  tableName: "Companies",
})
export default class Company extends Model<CompanyType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

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
