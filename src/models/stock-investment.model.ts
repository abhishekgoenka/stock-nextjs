import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Company from "./company.model";

@Table
export default class StockInvestment extends Model<StockInvestment> {
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
  company: Company;
}
