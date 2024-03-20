import { Bl } from "src/Bl/Bl.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity('User')
export class User {
    @PrimaryGeneratedColumn( {type: 'bigint'})
    id: number;

    @Column()
    nom: string;

    @Column()
    matriculeFiscale: string;

    @Column()
    phoneNumber: number;

    @Column()
    gover: string;

    @Column()
    adress: string;


    @Column({ unique: true })
    email: string;

    @Column({ nullable: true }) 
    logo: string;

    @Column()
    password: string;

    @Column()
    fraisLivraison: number;//prixLiv

    @Column({ nullable: true })
    resetCode: number;

   @OneToMany(() => Bl, (bonDeLiv) => bonDeLiv.user)
   bonDeLiv: Bl[];

}
