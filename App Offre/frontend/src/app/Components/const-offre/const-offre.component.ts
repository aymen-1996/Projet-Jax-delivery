import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveAllService } from 'src/app/Services/save-all.service';
import { CreateBlDto } from 'src/app/models/CreateBlDto';
import {  PaginationControlsDirective } from 'ngx-pagination';
import 'ngx-pagination';
import { takeUntil } from 'rxjs';
@Component({
  selector: 'app-const-offre',
  templateUrl: './const-offre.component.html',
  styleUrls: ['./const-offre.component.css']
})
export class ConstOffreComponent implements OnInit {
  @ViewChild(PaginationControlsDirective) paginationControls!: PaginationControlsDirective;

  page = 1;
  limit = 10;
  totalItems = 0;
  users: any;
  blList: CreateBlDto[] = [];
  selectedBl: CreateBlDto | null = null; 
  filterForm!: FormGroup;
  modalForm!: FormGroup;
  filteredBlList: any[] = [];
  pagedBlList: CreateBlDto[] | null = [];
  totalPages = 0;
  errorMessage: string = ''
  blData: any;
  constructor(private service: SaveAllService, private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      dateBl: [''],
      matriculeFiscale: [''],
      reference: [''],
    });



    this.modalForm = this.formBuilder.group({
      id: [],
      matriculeFiscale: [''],
      CIN: [''],
      Mob: [''],
      colisRetour: [''],
      colisLivre: [''],
      colisechange: [''],
      poids: [''],
      duree: [''],
      COD: [''],
      reference: [''],
      Fixe: [''],
      address: [''],
    });

  }

  


  
  createBlDto: CreateBlDto = new CreateBlDto();

  ngOnInit(): void {
    this.users = JSON.parse(localStorage.getItem('currentUser') as string);
    this.GetAll();
  
  }


  ngAfterViewInit(): void {
    this.onCINInput();
    this.onMatriculeInput();
  }




  GetAll(): void {
  
    this.service.getBlByUserIdAndFiltrage<CreateBlDto>(
      this.users.user.id,
      this.page,
      this.limit,
      this.filterForm.value
    ).subscribe((paginatedResponse) => {
      this.blList = paginatedResponse.items;
      this.applyFilter();
    }, (error) => {
      console.error('Error fetching BL:', error);
    });
  }
  
  
  
  updateMatriculeFiscale() {
    const blId = this.selectedBl;
    const matriculeFiscaleControl = this.modalForm.get('matriculeFiscale');
  
    if (blId && matriculeFiscaleControl) {
      if (matriculeFiscaleControl.invalid) {
        this.errorMessage = 'Matricule Fiscale does not match the specified format. Please correct it.';
        return;
      } else if (this.modalForm.get('CIN')!.invalid) {
        this.errorMessage = 'CIN does not match the specified format. Please correct it.';
        return;
      }
  
      if (matriculeFiscaleControl.value) {
        matriculeFiscaleControl.setValidators([Validators.pattern(/^(\d{7}[a-zA-Z\/]+[a-zA-Z0-9\/]*)$/)]);
        this.errorMessage = 'Matricule Fiscale does not match the specified format. Please correct it.';
      } else {
        matriculeFiscaleControl.clearValidators();
      }
  
      // Update validity
      matriculeFiscaleControl.updateValueAndValidity();
  
      if (matriculeFiscaleControl.errors) { 
        this.errorMessage = 'Matricule Fiscale does not match the specified format. Please correct it.';
        return;
      }
  
      const updatedValue = { ...this.modalForm.value, matriculeFiscale: matriculeFiscaleControl.value };
      this.service.updateOffre(blId, updatedValue).subscribe(
        (response) => {
          console.log('Updated successfully:', response);
          this.GetAll();
          this.closeModal('myModal');
          this.modalForm.get('matriculeFiscale')?.enable();
          this.modalForm.get('CIN')?.enable();
          this.modalForm.reset();
  
          this.errorMessage = '';
        },
        (error) => {
          console.error('Update failed:', error);
          this.errorMessage = 'Failed to update Matricule Fiscale. Please try again.';
        }
      );
    }
  }
  
  
  
  
  
  
  
  

  GetBlById(blId: number) {
    this.service.findOneById(blId).subscribe(
      (response) => {
        this.blData = response;
        console.log('BL Data:', this.blData);
  
        this.modalForm.patchValue({
          id: this.blData.id,
          matriculeFiscale: this.blData.matriculeFiscale,
          CIN: this.blData.CIN,
          Mob: this.blData.Mob,
          colisRetour: this.blData.colisRetour,
          colisLivre: this.blData.colisLivre,
          colisechange: this.blData.colisechange,
          poids: this.blData.poids,
          duree: this.blData.duree,
          COD: this.blData.COD,
          reference: this.blData.reference,
          Fixe: this.blData.Fixe,
          address: this.blData.address,
        });
      },
      (error) => {
        console.error('Error fetching BL:', error);
      }
    );
  }
  
  openModal1(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }
  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
  
    }
  }
  
  
 
  
  openModal(blId: number): void {
    this.selectedBl = this.blList.find(bl => bl.id === blId) || null;
    
    if (!this.blData || this.blData.id !== blId) {
      this.GetBlById(blId);
    }
  
    console.log('Selected blId:', blId);
    this.openModal1('myModal');
  }
  
  

  applyFilter(): void {  
    const dateBlFilter = this.filterForm.value.dateBl;
    const matriculeFiscaleFilter = this.filterForm.value.matriculeFiscale.toLowerCase();
    const referenceFilter = this.filterForm.value.reference.toLowerCase();
  
    this.filteredBlList = this.blList.filter((bl) => {
      const dateBlMatches = !dateBlFilter || new Date(bl.dateBl).toDateString() === new Date(dateBlFilter).toDateString();
      const matriculeFiscaleMatches = !matriculeFiscaleFilter || bl.matriculeFiscale?.toLowerCase().includes(matriculeFiscaleFilter);
      const referenceMatches = !referenceFilter || bl.reference.toLowerCase().includes(referenceFilter);
  
      return dateBlMatches && matriculeFiscaleMatches && referenceMatches;
    });
  
    this.totalItems = this.filteredBlList.length;
    this.totalPages = Math.ceil(this.totalItems / this.limit);
  
    if (this.page > this.totalPages) {
      this.changePage(this.totalPages);
    } else {
      this.changePage(1);
    }
  
    if (this.totalItems === 0) {
      this.pagedBlList = null;
    }
  }
  
  
  

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.pagedBlList = this.filteredBlList.slice(
        (this.page - 1) * this.limit,
        this.page * this.limit
      );
    }
  }

  getPagesArray(): number[] {
    return new Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
  generatePdf(idBl: number) {
    this.service.downloadPdf(idBl).subscribe(
      (data) => {
        this.downloadPdf(data);
      },
      (error) => {
        console.error('Error generating PDF:', error);
      }
    );
  }

  private downloadPdf(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-pdf.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  

  
  isMatriculeFilled : boolean = false;
  isCINFilled: boolean = false;

  onMatriculeInput(): void {
    const matriculeFiscaleValue = this.modalForm.get('matriculeFiscale')?.value;
    this.isCINFilled = !!matriculeFiscaleValue;
  
    if (!matriculeFiscaleValue) {
      this.modalForm.get('CIN')?.enable();
    } else {
      this.modalForm.get('CIN')?.disable();
    }
  }

  onCINInput(): void {
    const CINValue = this.modalForm.get('CIN')?.value;
    this.isMatriculeFilled = !!CINValue;
  
    if (!CINValue) {
      this.modalForm.get('matriculeFiscale')?.enable();
    } else {
      this.modalForm.get('matriculeFiscale')?.disable();
    }
  }

}