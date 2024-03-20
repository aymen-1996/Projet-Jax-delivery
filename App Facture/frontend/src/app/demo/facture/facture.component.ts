// angular import
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { facture } from 'src/app/models/Doc/facteur/facteur';
import { client } from 'src/app/models/client/client/client';
import { AdminService } from 'src/app/service/admin.service';
import { ClientService } from 'src/app/service/client.service';
import { FormService } from 'src/app/service/form.service';
@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export  class FactureComponent {
  loading: boolean = false;

  @Input() clientdata?:client;
  facture:facture= new facture()
  client!: client ;
  users: any;
  clients: any = {};
  intermediateSum: number = 0;
  selectedClient: client | undefined;
  id=this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {
    this.getClient()
    this.generateFactureNumber()
this.facture.QteColLiv=1
this.facture.QteColRet= 1
this.facture.QteColEchg=1
this.facture.QteCOD=1
this.facture.QteSBMF=1
this.facture.QteSBGF=1

    this.facture.TimbreFSC=0.99

    this.facture.code=0

    this.users = JSON.parse(localStorage.getItem('currentUser') as string);

}

successMessage: string = ''

constructor(private formBuilder: FormBuilder,private dataClient:ClientService,private authService: AdminService,
  private router: Router, private formService: FormService,private activatedRoute:ActivatedRoute,

  ) {

}


showRow: boolean[] = [true, true, true, true, true, true]; // Initial visibility for each row

onChange(event: any): void {
  // Your existing onChange logic here
}


hideRow(index: number): void {
  this.showRow[index] = false;
  if (index === 0) {
    this.facture.QteColLiv = 0;
    this.clients.PColLiv = 0;
    this.facture.MHTColLiv = 0;
    // Reset other values as needed
  } else if (index === 1) {
    this.facture.QteColRet = 0;
    this.clients.PColRet = 0;
    this.facture.MHTColRet = 0;
    // Reset other values as needed
  }else if (index === 2) {
    this.facture.QteColEchg = 0;
    this.clients.PColEchg = 0;
    this.facture.MHTColEchg = 0;
    // Reset other values as needed
  }else if (index === 3) {
    this.facture.QteCOD = 0;
    this.clients.Pcod = 0;
    this.facture.MHTCOD = 0;
    // Reset other values as needed
  }else if (index === 4) {
    this.facture.QteSBMF = 0;
    this.clients.Psbmf = 0;
    this.facture.MHTSBMF = 0;
    // Reset other values as needed
  }
  else if (index === 5) {
    this.facture.QteSBGF = 0;
    this.clients.Psbgf = 0;
    this.facture.MTHTBGF = 0;
    // Reset other values as needed
  }
  this.Calcul()

}
Calcul() {
  this.facture.MHTColLiv = this.clients.PColLiv * this.facture.QteColLiv || 0;
  this.facture.MHTColRet = this.clients.PColRet * this.facture.QteColRet || 0;
  this.facture.MHTColEchg = this.clients.PColEchg * this.facture.QteColEchg || 0;
  this.facture.MHTCOD = this.clients.Pcod * this.facture.QteCOD || 0;
  this.facture.MHTSBMF = this.clients.Psbmf * this.facture.QteSBMF || 0;
  this.facture.MTHTBGF = this.clients.Psbgf * this.facture.QteSBGF || 0;

  this.facture.MTHT =
    this.facture.MHTColLiv +
    this.facture.MHTColRet +
    this.facture.MHTColEchg +
    this.facture.MHTCOD +
    this.facture.MHTSBMF +
    this.facture.MTHTBGF || 0;

  const discountPercentage = this.facture.Remise || 0;
  const discountFactor = 1 - discountPercentage / 100 || 0;
  this.facture.TotHT = discountFactor * this.facture.MTHT;

  this.facture.TotTVA = this.facture.TotHT * 0.19;

  if (this.facture.TimbreFSC !== undefined && this.facture.TimbreFSC !== null && this.facture.code !== undefined && this.facture.code !== null) {
    this.facture.MontTTC = this.facture.TotHT + this.facture.TotTVA + this.facture.TimbreFSC || 0;
  } else {
    this.facture.MontTTC = this.facture.TotHT + this.facture.TotTVA || 0;
  }

  this.calculateRemis();
}

generateFactureNumber(): void {
  this.formService.generateFactureNumber(this.id)
    .subscribe(response => {
      this.facture.numFact = response.factureNumber;
      console.log("numfact", this.facture.numFact)
    }, error => {
      console.error('Error generating facture number:', error);
    });
}

calculateRemis() {
  const discountPercentage = this.facture.code || 0;
  const discountFactor = 1 - discountPercentage / 100 || 0;

  this.facture.TotHT = discountFactor * this.facture.MTHT || 0;
}


createFacteur() {
  if (
    !this.facture.numFact ||
    !this.facture.dateFact ||
    !this.facture.datePay ||
    !this.facture.dateEch
  ) {
    this.successMessage = 'err!';
    // You might want to show a user-friendly error message
    return;
  }

  this.loading = true; // Set loading to true when starting the request

  this.formService.createFacteure(this.id, this.facture).subscribe(
    (response) => {
      this.facture = new facture();
      console.log('Fid', response.factId);
      this.successMessage = 'Facture created successfully!';
      this.facture.TimbreFSC = 0.99;
      this.facture.Remise = 0;
      this.downloadPdf(response.factId);
      this.loading = false; // Set loading to false when the request is complete

    },
    (error) => {
      console.error('Error creating facture:', error);
      this.loading = false; // Set loading to false when the request is complete

    },

  );
}

downloadPdf(factId: number) {
  this.formService.downloadPdf(factId).subscribe(
    (pdfBlob: Blob) => {
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
    },
    (pdfError) => {
      console.error('Error downloading PDF', pdfError);
    }
  );
}


getClient(){
  this.activatedRoute.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {

    this.dataClient.getClientById(this.id).subscribe(
      (data) => {
        this.clients = data;
        this.Calcul()

        console.log("client", this.clients);
      },
      (error) => {
        console.error('Error fetching client data:', error);
      }
    );
    
  });
}

}
