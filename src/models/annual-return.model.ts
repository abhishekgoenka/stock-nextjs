import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

export type AnnualReturnType = {
  id?: number;
  year: number;
  investments: number;
  expectedReturn: number;
  actualReturn: number;
  actualReturnPercentage: number;
  indexReturn: number;
  exchange: string;
};

@Table
export default class AnnualReturn extends Model<AnnualReturnType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @Column
  year: number;

  @Column
  investments: number;

  @Column
  expectedReturn: number;

  @Column
  actualReturn: number;

  @Column
  actualReturnPercentage: number;

  @Column
  indexReturn: number;

  @Column
  exchange: string;
}
