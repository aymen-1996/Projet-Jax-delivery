import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Colis } from '../models/performance';




interface PaginatedResponse<T> {
  totalItems: number;
  items: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private successMessageSubject = new BehaviorSubject<string | null>(null);
  successMessage$ = this.successMessageSubject.asObservable();
  colisCreated: EventEmitter<boolean> = new EventEmitter<boolean>();

  showSuccessMessage(message: string): void {
    this.successMessageSubject.next(message);
  }
  constructor(private http: HttpClient) {

   }

  //getAllColis //pagination
 getAllColis():Observable<Colis[]>{
  return this.http.get<Colis[]>( `${environment.backendHost}/colis`)
 }



 getAllColisFiltre<T>(page: number, limit: number, nomCl?: string, nomCom?: string, gov?: string, date?: Date): Observable<PaginatedResponse<T>> {
  let params = new HttpParams();

  if (typeof nomCl === 'string' && nomCl.trim() !== '') {
    params = params.set('nomCL', nomCl.trim());
  }

  if (typeof nomCom === 'string' && nomCom.trim() !== '') {
    params = params.set('nomCom', nomCom.trim());
  }

  if (typeof gov === 'string' && gov.trim() !== '') {
    params = params.set('gov', gov.trim());
  }

  if (date) {
    const formattedDate = date.toISOString().split('T')[0];
    params = params.set('date', formattedDate);
  }

  return this.http.get<PaginatedResponse<T>>(
    `${environment.backendHost}/colis/getAllColis/${page}/${limit}`,
    { params }
  );
}
 getAllClients(): Observable<string[]> {
  return this.http.get<string[]>(`${environment.backendHost}/colis/clients/all`);
}
  //CreateColis
  createColis(colis:Colis): Observable<any> {
    const requestBody = {
      ...colis
    };

    console.log('Request Payload:', requestBody);

    return this.http.post(`${environment.backendHost}/colis/create`, requestBody);
  }

  //UpdateColis
   uploadExcel( file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.backendHost}/colis/upload-excel`,formData )
   }


  //getColis
  getAllCommerciaux():Observable<any>{
    return this.http.get<any>(`${environment.backendHost}/colis/commerciaux/all`)
  }

  getChiffre<T>(page: number, limit: number, nomCL?: string, nomCom?: string, gov?: string, date?: Date): Observable<PaginatedResponse<T>> {
    let params = new HttpParams();

    if (typeof nomCL === 'string' && nomCL.trim() !== '') {
      params = params.set('nomCL', nomCL.trim());
    }

    if (typeof nomCom === 'string' && nomCom.trim() !== '') {
      params = params.set('nomCom', nomCom.trim());
    }

    if (typeof gov === 'string' && gov.trim() !== '') {
      params = params.set('gov', gov.trim());
    }

    if (date) {
      params = params.set('date', date.toISOString()); // Ensure date is formatted correctly
    }

    return this.http.get<PaginatedResponse<any>>(
     ` ${environment.backendHost}/colis/chiffres/all/${page}/${limit}`,
      { params }
    );
  }
//filtre+pagination //ye5i el filter ynajem ya5tar 2kther men we7ed ?
getColisFiltre<T>(
  page: number,
  limit: number,nomCL?: string[],nomCom?: string[],
  gov?: string[],
  date?: Date,
):Observable<PaginatedResponse<T>>{
  let params = new HttpParams();
  if (nomCL && nomCL.length > 0) {
    const nomCLString = Array.isArray(nomCL) ? nomCL.join(',') : nomCL;
    params = params.set('nomCL', nomCLString);
  }
  if (nomCom && nomCom.length > 0) {

    const nomComString = Array.isArray(nomCom) ? nomCom.join(',') : nomCom;
    params = params.set('nomCom', nomComString);
  }
  if (gov && gov.length > 0) {

    const govString = Array.isArray(gov) ? gov.join(',') : gov;
    params = params.set('gov', govString);
  }
  if (date) {
    params = params.set('date',date instanceof Date ? date.toISOString():'');
  }
  return this.http.get<PaginatedResponse<T>>(
    `${environment.backendHost}/colis/getAllColis/${page}/${limit}`,
    { params }
  );
}
getChiffreById(iC: number): Observable<any[]> {
  const url = `${environment.backendHost}/colis/chiffre/${iC}/client`;
  return this.http.get<any[]>(url);
}

private validerClickedSource = new Subject<void>();

validerClicked$ = this.validerClickedSource.asObservable();

triggerValiderClicked() {
  this.validerClickedSource.next();
}
getAllClientsfiltre(nomCL?: string): Observable<string[]> {
  const url = nomCL ? `${environment.backendHost}/colis/clients/filtre?nomCL=${nomCL}` : `${environment.backendHost}/colis/clients/filtre`;

  return this.http.get<string[]>(url);
}

}
