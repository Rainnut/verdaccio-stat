import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Npmpackage {
  @PrimaryColumn("int")
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  version!: string;

  @Column("text", {
    nullable: true
  })
  tag!: string;

  @Column("int", {
    nullable: true
  })
  downloadNum!: number;
  
  @Column("text", {
    nullable: true
  })
  description!: string;
}