import { Model, Column, Table, PrimaryKey, AutoIncrement } from "sequelize-typescript";

@Table
export default class Sale extends Model<Sale> {
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
