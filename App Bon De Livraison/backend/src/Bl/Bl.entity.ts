// bl.entity.ts
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity({name: 'Bl'})
export class Bl {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;
  //reference men win tji ?

  

    @Column({ nullable: true })
    external_ref:string;
  //Destinaraire
    @Column()
    nom_prenom: string;

    @Column()
    tel1:string  ;

    
    @Column()
    tel2:string  ;

    @Column({ nullable: true })
    echange: boolean;

    @Column()
    adresse:String;

    @Column()
    governorate:string;

    @Column()
    cr_bt: number |null;//cr_bt 

    @Column()
    description: string;

    @Column({ nullable: true })
    dateBl: Date;

    @Column({ nullable: true })
    delegation:string;


    @Column({ nullable: true })
    quantite:number;


    @Column({ nullable: true })
    blname:string;

  
    //Colis
    @ManyToOne(()=> User,(user)=> user.bonDeLiv)
    @JoinColumn({ name: 'userId'  })
    user: User

   /* @Column()
    prixLiv: number;//besh nzidu 3lih tva //shnuwa el fonction mta3 tva= 8.00=fraislivra*/



}
