import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

export type DepositType = {
  id?: number;
  date: string;
  desc: string;
  from: string;
  to: string;
  currency: string;
  amount: number;
};

@Table
export default class Deposit extends Model<DepositType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  date!: string;

  @Column
  desc!: string;

  @Column
  from!: string;

  @Column
  to!: string;

  @Column
  currency!: string;

  @Column
  amount!: number;
}
