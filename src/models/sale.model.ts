import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

export type SaleType = {
  company: string;
  purchaseDate: string;
  saleDate: string;
  qty: number;
  purchasePrice: number;
  salePrice: number;
  charges: number;
  exchange: string;
  broker: string;
  currency: string;
};

@Table
export default class Sale extends Model<SaleType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  company!: string;

  @Column
  purchaseDate!: string;

  @Column
  saleDate!: string;

  @Column
  qty!: number;

  @Column
  purchasePrice!: number;

  @Column
  salePrice!: number;

  @Column
  charges!: number;

  @Column
  exchange!: string;

  @Column
  broker!: string;

  @Column
  currency!: string;
}
