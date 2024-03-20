/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { client } from "src/client/client.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn,} from "typeorm";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    password: string;

    @OneToMany(() => client, (client) => client.user)
    clients: client[];


}
    /*
    @Column({ nullable: true })
    resetCode: number;
    */

