import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

export type MutualFundType = {
  id?: number;
  name: string;
  equity: number;
  debt: number;
  others: number;
  largeCap: number;
  midCap: number;
  smallCap: number;
  otherCap: number;
  url: string;
  exchange: string;
  symbol: string;
  currentPrice: number;
  indexFund: boolean;
};

@Table
export default class MutualFund extends Model<MutualFundType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  equity!: number;

  @Column
  debt!: number;

  @Column
  others!: number;

  @Column
  largeCap!: number;

  @Column
  midCap!: number;

  @Column
  smallCap!: number;

  @Column
  otherCap!: number;

  @Column
  url!: string;

  @Column
  exchange!: string;

  @Column
  symbol!: string;

  @Column
  currentPrice!: number;

  @Column
  indexFund!: boolean;
}
