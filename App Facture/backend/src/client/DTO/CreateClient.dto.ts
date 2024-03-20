/* eslint-disable prettier/prettier */
export class CreateClientDto { 
    [key: string]: any;
//info Client
idCL: number;
    nomProjet: string;
    nomCL: string;
    MFCL: string;
    telCL: number;
    adresseCL: string;

//Prix 
    PColLiv: number;
    PColRet: number;
    PColEchg: number;
    PUHTCOD: number;
    PUHTSBMF: number;
    PUHTSBGF: number;

    
  }