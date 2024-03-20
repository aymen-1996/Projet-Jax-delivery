export class facture{
    idF!: number;
    
    numFact!:string;
    
    dateFact!: Date;
    
    datePay!: Date;
    
    dateEch!: Date;
    //Tableau
    
    code!:number;
    
    Desgn!:string  ;
    
    //Quantité 
    QteColLiv!:number ; //Quantité colis livrés
    
    QteColRet!:number ; // qt colis retour
    
    QteCOD!:number ; // qte COD
    
    QteColEchg!:number ; // qte colis echange
    
    QteSBMF!:number ; // qte savebag MF
    
    QteSBGF!:number ; // qte savebag GF
    //Montant apres calcul 
    
    MHTColLiv!:number // Montant HT colis livrés
    
    MHTColRet!:number ; // Montant HT colis retour
    
    MHTCOD!:number ;  //Montant HT COD
    
    MHTColEchg!:number ;  //Montant HT colis echange
    
    MHTSBMF!:number ; //Montant HTsavebag MF
     
    MTHTBGF!:number ;  //Montant HTsavebag GF
    
    MTHT!:number ;  //  montant Total HT
    
    TotHT!:number ;  //  total HT
    
    TotTVA!:number ;  // Total TVA
    
    TimbreFSC!:number ;  //Timbre Fiscale
    
    MontTTC!:number ; //Montant TTC

    Remise!:number;

 
}
