import { client } from 'src/client/client.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name: 'Fact'})
export class facture {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    idF: number;
    @Column({ nullable: true })
    numFact:string; //ey
    @Column({ nullable: true })
    dateFact: string;//ey
    @Column({ nullable: true })
    datePay: string;//ey
    @Column({ nullable: true })
    dateEch: string;//ey
    //Tableau
    @Column({ nullable: true })
    code:number;//yetjanera 
    @Column({ nullable: true })
    Desgn:string  ; //yet7at
    @Column({ nullable: true })
    //Quantité 
    QteColLiv:number ; //Quantité colis livrés //par defaut 1 wo mba3ed ya3mel update 
    @Column({ nullable: true })
    QteColRet:number ; // qt colis retour
    @Column({ nullable: true })
    QteCOD:number ; // qte COD
    @Column()
    QteColEchg:number ; // qte colis echange
    @Column()
    QteSBMF:number ; // qte savebag MF
    @Column({ nullable: true })
    QteSBGF:number ; // qte savebag GF


    //Montant apres calcul //yetjenera au meme temps 
    @Column({ nullable: true })
    MHTColLiv:number // Montant HT colis livrés
    @Column({ nullable: true })
    MHTColRet:number ; // Montant HT colis retour
    @Column({ nullable: true })
    MHTCOD:number ;  //Montant HT COD
    @Column({ nullable: true })
    MHTColEchg:number ;  //Montant HT colis echange
    @Column({ nullable: true })
    MHTSBMF:number ; //Montant HTsavebag MF
    @Column({ nullable: true }) 
    MTHTBGF:number ;  //Montant HTsavebag GF
    @Column({ nullable: true })
    MTHT:number ;  //  montant Total HT
    @Column({ nullable: true, type: 'float' })
    TotHT:number ;  //  total HT
    @Column({ nullable: true, type: 'float' })
    TotTVA:number ;  // Total TVA
    @Column({ nullable: true, type: 'float' })
    TimbreFSC:number ;  //Timbre Fiscale //dima nafsu 
    @Column({ nullable: true, type: 'float' })
    MontTTC:number ; //Montant TTC

    @Column({ nullable: true, type: 'float' })
    Remise:number;
 // relation avec client 
 @OneToMany(() => facture, (Factures) => Factures.client)
    Factures: facture[];
    Client: any;

 @ManyToOne(()=> client,(client)=> client.Factures)
 @JoinColumn({ name: 'clientId'  })
 client: client;

/*@Column()
reference:string;*/
   
}