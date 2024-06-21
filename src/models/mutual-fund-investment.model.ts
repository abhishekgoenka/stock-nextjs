import { Model, Column, Table, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey } from "sequelize-typescript";
import MutualFund from "./mutual-fund.model";

export type MutualFundInvestmentType = {
  id?: number;
  mutualFundID: number;
  purchaseDate: string;
  qty: number;
  price: number;
  stt: number;
  brokerage: number;
  otherCharges: number;
  currency: string;
  broker: string;
};

@Table
export default class MutualFundInvestment extends Model<MutualFundInvestmentType> {
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
  mutualFund: ReturnType<() => MutualFund>;
}
