export class Colis {
    idC!: number;

    
    code!:string // Code Coli

     //code

    
    nomCl!:string; //NomClient

    
    nomCom!: string; //NomCommercial

    
    gov!: string; // Gouvernaurat
    
    
    ColLiv!: number; //  nombre Colis Livré

    
    FrLiv!: number; // Frais Livraison // insert f BD

    
    ColRtr!: number; // nombre Colis Retour

    
    FrRtr!: number; // Frais Retour // insert f BD

   
    Cr!: number; // Contre Rembourcement

    
    date!:Date;// date paiement 

    //Calcul CA a faire apres creation coli
    
    Global!: number; // Global

    
    CaLiv!: number; // CA Livraison

    
    caRtr!: number; // CA Retour

    
    CaAutre!: number; // CA Autre

    
    CrCa!: number; // CR/CA // cr par rapport ca

    
    CaGlobal!: number; // CA date /Global

    
    FLivMoy!: number; // Frais Liv Moy

    
    FRtrMoy!: number; // Frais Retour Moy
   
}
