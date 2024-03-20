import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
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
import { SavebagService } from '../services/savebag.service';
import { Savebag } from '../models/savebag';
import { Observable, startWith, map } from 'rxjs';
import { PerformanceService } from '../services/performance.service';
import { Colis } from '../models/performance';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-form-savebag',
  templateUrl: './form-savebag.component.html',
  styleUrls: ['./form-savebag.component.scss']
})
export class FormSavebagComponent {

  @Output() validerClicked: EventEmitter<void> = new EventEmitter<void>();


  selectedFile: File | null = null;
  savebagList:  string[] = [];
  savebagform!:FormGroup;

  users: any;
  creSavebag:Savebag =new Savebag();
  successMessage: string = ''
  filteredClients!:Observable<Colis[]>
  savebagListauto: Colis[] = [];

  constructor(private formPerformance: PerformanceService,private formsavebag: SavebagService ,private form:FormBuilder) {
    this.savebagform= this.form.group({
      nomCl:['', Validators.required],
      sbmf:['', Validators.required], //Savebag livre hiya elli recu par l'expediteur ?
      Psbmf:['', Validators.required],//famma coli retour wo mafamesh cols recu
      sbgf:['', Validators.required],
      Psbgf:['', Validators.required]

    })
  }





  onInputBlur(): void {
    const selectedClient = this.savebagform.get('nomCl')!.value;

    if (selectedClient) {
      this.savebagform.get('nomCl')!.setValue(selectedClient.nomCl);
    }
  }


  displayClient(client: Colis): string {
    return client.nomCl ? client.nomCl : '';
  }

  private _filterClients(value: string): Colis[] {
    const filterValue = value.toLowerCase();

    return this.savebagListauto.filter((client) =>
      client.nomCl.toLowerCase().includes(filterValue)
    );
  }

  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  matcher = new MyErrorStateMatcher();




  createSavebag(): void {
    if (this.savebagform.invalid) {
      this.savebagform.markAllAsTouched();
      return;
    }

    const formValues = this.savebagform.value;
    this.formsavebag.creatSavebag(formValues).subscribe(
      (response) => {
        this.successMessage = 'Savebag created successfully!';
        console.log('Savebag created successfully', response);
        this.showSuccessAlert();

        response.date = response.date ?
          new Date(response.date).toISOString().split('T')[0] :
          'N/A';


        this.formsavebag.updateSavebagList(response);
        this.formsavebag.removeSavebagFromList(response);
        this.formsavebag.updateChiffreList(response);
        this.formsavebag.removeChiffreFromList(response);

        console.log('Updated savebagList in FormSavebagComponent:', response);

        this.savebagform.reset();
        this.validerClicked.emit();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  private showSuccessAlert(): void {
    // Display a success alert using Alertify
    alertify.success('Colis créé avec succès!');
  }

  getAllClients():void{
    this.formsavebag.getAllClients().subscribe((date)=>{
      this.savebagList= date;
      console.log(this.savebagList);
    });
  }

  getAllClientsAll():void{
    this.formPerformance.getAllColis().subscribe((date)=>{
      this.savebagListauto= date;
      console.log(this.savebagListauto);
    });
  }

  ngOnInit(): void {
    this.getAllClientsAll();



     this.filteredClients = this.savebagform.get('nomCl')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterClients(value))
    );
  }

}
