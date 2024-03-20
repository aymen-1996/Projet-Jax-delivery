/* eslint-disable prettier/prettier */
export class UpdateteFactDto{
    idF: number;
    numFact:string;
    dateFact: string;
    datePay: string;
    dateEch: string;
    code:number;
    Desgn:string  ;
    QteColLiv:number ; //Quantité colis livrés
    QteColRet:number ; // qt colis retour
    QteCOD:number ; // qte COD
    QteColEchg:number ; // qte colis echange
    QteSBMF:number ; // qte savebag MF
    QteSBGF:number ; // qte savebag GF
    //Montant apres calcul 
    MHTColLiv:number // Montant HT colis livrés
    MHTColRet:number ; // Montant HT colis retour
    MHTCOD:number ;  //Montant HT COD
    MHTColEchg:number ;  //Montant HT colis echange
    MHTSBMF:number ; //Montant HTsavebag MF
    MTHTBGF:number ;  //Montant HTsavebag GF
    MTHT ;  //  montant Total HT
    TotHT:number ;  //  total HT
    TotTVA:number ;  // Total TVA
    TimbreFSC:number ;  //Timbre Fiscale
    MontTTC:number ; //Montant TTC

   
}
    
