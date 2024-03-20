import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationControlsDirective } from 'ngx-pagination';
import { EmailInfo } from 'src/app/models/client/client/EmailInfo';
import { client } from 'src/app/models/client/client/client';
import { AdminService } from 'src/app/service/admin.service';
import { ClientService } from 'src/app/service/client.service';
import { FormService } from 'src/app/service/form.service';

@Component({
  selector: 'app-repertoire',
  templateUrl: './repertoire.component.html',
  styleUrls: ['./repertoire.component.scss']
})
export  class RepertoireComponent implements OnInit {


  @ViewChild(PaginationControlsDirective) paginationControls!: PaginationControlsDirective;

  users: any;
  createBlDto: client = new client();
emailInfo: EmailInfo = new EmailInfo();
clients!:client[]
  successMessage: string = ''
  successMessagea: string = ''

clientsPagin:client[]=[];
pagedClientList: client[] | null = [];


  page = 1;
  limit = 6;
  totalItems = 0;
  totalPages = 0;
  filteredFactList: client[] = [];
    filterForm:FormGroup

  ngOnInit(): void {
      this.users = JSON.parse(localStorage.getItem('currentUser') as string);

      this.getAllClients();


  }

  constructor(private _dataLoggedin: AdminService,private clientService:ClientService,private _dataClient:ClientService ,
    private authService: AdminService, private router: Router, private formService: FormService,private formBuilder:FormBuilder
    ) {
      this.filterForm = this.formBuilder.group({
        nomCL: [''],
      });

    }

  createClient() {


  // Check if all required fields are filled
  if ( !this.createBlDto.nomCL ||
    !this.createBlDto.mfCL ||
    !this.createBlDto.telCL ||
    !this.createBlDto.adresseCL ||
    !this.createBlDto.PColLiv ||
    !this.createBlDto.PColRet ||
    !this.createBlDto.PColEchg ||
    !this.createBlDto.Pcod ||
    !this.createBlDto.Psbmf ||
    !this.createBlDto.Psbgf
    ||!this.createBlDto.Psbgf
  ) {
    // If any required field is empty, show an error message or handle it as needed
    this.successMessagea = 'Please fill in all required fields.';
    return;
  }

    console.log(this._dataLoggedin.logedin)
    if (this.users.adminn !==null && this.users.user ==null){
      this.formService.createClientByAdmin(this.users.adminn.id, this.createBlDto).subscribe(
        (response) => {
          this.successMessage = 'Client created successfully!';
          console.log('Client created successfully', response);
          this.createBlDto = new client();
         this.toggleModal();

       }
      );
    }else if (this.users.adminn==null && this.users.user !==null){
      this.formService.createClientByUser(this.users.user.id, this.createBlDto).subscribe(
        (response) => {
          this.successMessage = 'Client created successfully!';
          console.log('Client created successfully', response);
          this.createBlDto = new client();
         this.toggleModal();

       }
      );

    }

    }


  downloadPdf(blId: number) {
    this.formService.downloadPdf(blId).subscribe(
      (pdfBlob: Blob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
      },
      (pdfError) => {
        console.error('Error downloading PDF', pdfError);
      }
    );
  }

  downloadExcel(): void {
    this.formService.generatePdf();
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }






  ajouteFacture(clientId: number){
    this.clientService.getClientById(clientId).subscribe(
      (clientData) => {
        // Assuming clientData is of type client
        this._dataClient.client = clientData;
        this.router.navigate(['/facture']);
      },
      (error) => {
        console.error('Error fetching client data:', error);
        // Handle the error as needed
      }
    );
  }

  modalVisible = false;
  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }

  //openModel
  openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }

  }

  //closeModal
  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';

    }
  }


//getallclient
getAllClients(): void {
  this.clientService.getallClient<client>(1,
      this.totalItems,this.filterForm.value.nomCL,
    )
    .subscribe((paginatedResponse) => {
      this.clientsPagin = paginatedResponse.items;

      this.applyFilter();
    });
}

applyFilter(): void {
  const nomCL = this.filterForm.value.nomCL.toLowerCase();

  this.filteredFactList = this.clientsPagin.filter((client) => {
    const matriculeFiscaleMatches = !nomCL || client.nomCL?.toLowerCase().includes(nomCL);
    console.log(matriculeFiscaleMatches)
    return matriculeFiscaleMatches;

  });

  this.totalItems = this.filteredFactList.length;
  this.totalPages = Math.ceil(this.totalItems / this.limit);

  if (this.page > this.totalPages) {
    this.changePage(this.totalPages);
  } else {
    this.changePage(1);
  }

  if (this.totalItems === 0) {
    this.pagedClientList = null;
  }
}

changePage(newPage: number): void {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.pagedClientList = this.filteredFactList.slice(
      (this.page - 1) * this.limit,
      this.page * this.limit
    );
  }
}


getPagesArray(): number[] {
  return new Array(this.totalPages).fill(0).map((_, index) => index + 1);
}


}
