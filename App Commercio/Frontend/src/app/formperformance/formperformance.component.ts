import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Colis } from '../models/performance';
import * as alertify from 'alertifyjs';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { ErrorStateMatcher } from '@angular/material/core';
import {NgIf} from '@angular/common';
import { PerformanceService } from '../services/performance.service';
import { Observable, map, startWith, timeout } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-formperformance',
  templateUrl: './formperformance.component.html',
  styleUrls: ['./formperformance.component.scss']
})
export class FormperformanceComponent {
  @Output() validerClicked: EventEmitter<void> = new EventEmitter<void>();


  @ViewChild('fileInput') fileInput: ElementRef | undefined;


  filteredClients!:Observable<Colis[]>
  selectedFile: File | null = null;
  colisList!: Colis[] ;
  coliform!:FormGroup;
  colis: Colis = new Colis();
  users: any;
  creColis:Colis =new Colis();
  successMessage: string = ''
  isFormSubmitted: boolean = false;

  constructor(private formPerformance: PerformanceService ,private form:FormBuilder) {
    this.coliform= this.form.group({
      nomCl:['', Validators.required],
      ColLiv:['', Validators.required], //colis livre hiya elli recu par l'expediteur ?
      ColRtr:['', Validators.required],//famma coli retour wo mafamesh cols recu
      CaAutre:['', Validators.required],
      Cr:['', Validators.required]

    })


  }



  ngOnInit(): void {
    this.getAllClients();

    this.filteredClients = this.coliform.get('nomCl')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterClients(value))
    );


  }
  onInputBlur(): void {
    const selectedClient = this.coliform.get('nomCl')!.value;

    if (selectedClient) {
      this.coliform.get('nomCl')!.setValue(selectedClient.nomCl);
    }
  }


  displayClient(client: Colis): string {
    return client.nomCl ? client.nomCl : '';
  }

  private _filterClients(value: string): Colis[] {
    const filterValue = (typeof value === 'string') ? value.toLowerCase() : '';

    if (this.colisList) {
      return this.colisList.filter((client) =>
        (typeof client.nomCl === 'string') && client.nomCl.toLowerCase().includes(filterValue)
      );
    } else {
      // Handle the case where colisList is not yet defined
      return [];
    }
  }

  isFormEmpty(): boolean {
    // Check if all form controls are empty
    const controls = this.coliform.controls;
    return Object.keys(controls).every(controlName => controls[controlName].value === null || controls[controlName].value === '');
  }


  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  matcher = new MyErrorStateMatcher();





  createColis(): void {
    if (this.selectedFile && !this.coliform.valid) {
      this.uploadExcel();
      alertify.success('uploaded sucess');

      this.coliform.reset();
      this.validerClicked.emit();
      this.formPerformance.triggerValiderClicked();
       //add timeout=1;
    } else if(this.coliform.valid && !this.selectedFile ){
      const formValues = this.coliform.value;
      this.formPerformance.createColis(formValues).subscribe(
        (response) => {
          this.successMessage = 'Client created successfully!';
          console.log('Client created successfully', response);
          this.showSuccessAlert();
          this.formPerformance.colisCreated.emit(true);
          this.coliform.reset();
          this.validerClicked.emit();
          this.formPerformance.triggerValiderClicked();
          // Emit the event when "Valider" is clicked
        },
        (error) => {
          console.error(error);
          // Handle error appropriately
        }
      );
    }else{
      this.isFormSubmitted = true;
      alertify.error('choose something')
    }

  }
  private showSuccessAlert(): void {
    // Display a success alert using Alertify
    alertify.success('Colis créé avec succès!');
  }

  getAllClients():void{
    this.formPerformance.getAllColis().subscribe((date)=>{
      this.colisList= date;
      console.log(this.colisList);
    });
  }



  clearFileInput(): void {
    const fileInputElement = this.fileInput!.nativeElement as HTMLInputElement;
    fileInputElement.value = '';
    this.selectedFile = null;
  }
  fileSelected: boolean = false;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.fileSelected = true;
  }

  uploadExcel():void{
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }
    this.formPerformance.uploadExcel(this.selectedFile).subscribe(
      response => {
        console.log(response);
        this.successMessage = 'File uploaded successfully.';
        this.clearFileInput();
        this.selectedFile = null;
      },
      error => {
        console.error(error);
        alert('Error uploading file.');
      }
    );
  }



}
