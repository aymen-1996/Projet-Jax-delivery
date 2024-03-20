 import { Bl } from "src/offre/Offre.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    matriculeFiscale: string;
    @Column()
    email: string;
    @Column()
    role: string;
    @Column()
    name: string;
    @Column()
    password: string;
    @Column()
    active: boolean;
    @Column({ nullable: true })
    resetCode: number;

   @OneToMany(() => Bl, (bonDeLiv) => bonDeLiv.user)
  bonDeLiv: Bl[];

}