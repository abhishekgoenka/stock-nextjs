import { Model, Column, Table, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey } from "sequelize-typescript";
import MutualFund from "./mutual-fund.model";

@Table
export default class MutualFundInvestment extends Model<MutualFundInvestment> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => MutualFund)
  @Column
  mutualFundID!: number;

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

  @BelongsTo(() => MutualFund)
  mutualFund: MutualFund;
}
