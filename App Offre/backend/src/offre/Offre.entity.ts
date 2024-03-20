/* eslint-disable prettier/prettier */
// bl.entity.ts
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity({name: 'offre'})
export class Bl {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

  //reference men win tji ?

    @Column()
    dateBl: Date;

    @Column({nullable:true})
    matriculeFiscale:string;

    @Column({nullable:true})
    CIN:string;
  //Destinaraire
 
    @Column()
    Mob:string  ;

    
    @Column()
    Fixe:string  ;

    @Column()
    address:string;

    @Column()
    colisLivre:number;

    @Column()
    colisRetour:number;

    //Colis

    @Column()
    colisechange: number;

    @Column()
    COD: number ;//cr_bt

    @Column()
    poids: number;

    @Column({nullable:true})
    duree: number;
    
    @Column()
    reference:string;
    @Column()
    verified!:boolean;
    @ManyToOne(()=> User,(user)=> user.bonDeLiv)
    @JoinColumn({ name: 'userId'  })
    user: User

    getNonEmptyIdentifier(): Promise<[string, string]> {
      if (this.matriculeFiscale != null  && this.matriculeFiscale != "1") {
        return Promise.resolve([this.matriculeFiscale, 'M.F']);
      } else if(this.CIN !=null && this.CIN !="1"){
        return Promise.resolve([this.CIN, 'CIN']);
      }else if (this.matriculeFiscale == null && this.CIN ==null ){
        return Promise.resolve(['non validé', 'non validé']);
      } 
    }
}