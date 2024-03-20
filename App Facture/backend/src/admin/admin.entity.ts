/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { client } from "src/client/client.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
@Entity({ name: 'admin' })
export class admin {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nomD: string;
    @Column()
    statut: string;
    @Column()
    emailD: string;
    @Column()
    passwordD: string;

    @OneToMany(() => client, (client) => client.admin)
    clients: client[];

}
    /*
    @Column({ nullable: true })
    resetCode: number;
    */
/*
    // relation avec Facture / Factures : table des facture 
    @OneToMany(() => Facture, (Factures) => Factures.user)
    Factures: Facture[];
    */
