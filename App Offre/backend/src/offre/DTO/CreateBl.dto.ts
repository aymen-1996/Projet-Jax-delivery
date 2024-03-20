export class CreateBlDto { 
  id!: number;
  matriculeFiscale?: string;
  CIN?: string;
  Mob!: string;
  colisRetour!: number;
  colisLivre!: number;
  colisechange!: number;
  poids!:number;
  duree!:number;
  COD!: number;
  dateBl!:Date;
  reference!: string;
  Fixe!:string;
  address!:string;
  verified!:boolean;
}


    function getNonEmptyIdentifier(): Promise<[string, string]> {
      if (this.matriculeFiscale != null) {
        return Promise.resolve([this.matriculeFiscale, 'M.F']);
      } else if(this.CIN !=null){
        return Promise.resolve([this.CIN, 'CIN']);
      }else return Promise.resolve(['non validé', 'non validé']);
    }