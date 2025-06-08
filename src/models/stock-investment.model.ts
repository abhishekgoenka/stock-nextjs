import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

import Company from "./company.model";

export type StockInvestmentType = {
  id?: number;
  companyID: number;
  purchaseDate: string;
  qty: number;
  price: number;
  stt: number;
  brokerage: number;
  otherCharges: number;
  currency: string;
  broker: string;
  company?: Company;
};

@Table({
  tableName: "StockInvestments",
})
export default class StockInvestment extends Model<StockInvestmentType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => Company)
  @Column
  companyID!: number;

  @Column
  purchaseDate!: string;

  @Column
  qty!: number;

  @Column
  price!: number;

  @Column
  stt!: number;

  @Column
  brokerage!: number;

  @Column
  otherCharges!: number;

  @Column
  currency!: string;

  @Column
  broker!: string;

  @BelongsTo(() => Company)
  company: ReturnType<() => Company>;
}
