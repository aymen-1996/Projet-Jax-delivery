/* eslint-disable prettier/prettier */
import { admin } from "src/admin/admin.entity";
import { facture } from "src/fact/fact.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
@Entity({ name: 'client' })
export class client {
    [x: string]: any;
    @PrimaryGeneratedColumn()
    idCL: number;
    @Column({ nullable: true })
    nomProjet: string;
    @Column({ nullable: true })
    nomCL: string;
    @Column({ nullable: true })
    mfCL : string;
    @Column({ nullable: true })
    telCL: number;
    @Column({ nullable: true })
    adresseCL: string;
    @Column({ nullable: true })
    PColLiv: number;
    @Column({ nullable: true })
    PColRet: number;
    @Column({ nullable: true })
    PColEchg: number;
    @Column({ nullable: true })
    Pcod: number;
    @Column({ nullable: true })
    Psbmf: number;
    @Column({ nullable: true })
    Psbgf: number;

    @OneToMany(() => facture, (Factures) => Factures.client)
    Factures: facture[];
    User: any;

//relation avec client
 @ManyToOne(()=> User,(user)=> user.clients)
 @JoinColumn({ name: 'UserId'  })
 user: User;

 //relation avec admin 
 @ManyToOne(()=> admin,(admin)=> admin.clients)
 @JoinColumn({ name: 'AdminId'  })
 admin: admin;

}

    /* en cas on aura reset code
    @Column({ nullable: true })
    resetCode: number;
    */

