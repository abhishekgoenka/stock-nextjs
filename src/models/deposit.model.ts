import {
  Model,
  Column,
  Table,
  BelongsToMany,
  Scopes,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";

@Table
export default class Deposit extends Model<Deposit> {
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
