import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table
export default class MutualFund extends Model<MutualFund> {
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
