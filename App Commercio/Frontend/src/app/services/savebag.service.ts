import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Savebag } from '../models/savebag';





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
export class SavebagService {
  colisCreated: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private http: HttpClient) { }


  private _savebagListSubject: BehaviorSubject<Savebag[]> = new BehaviorSubject<Savebag[]>([]);
  private _chiffreListSubject: BehaviorSubject<Savebag[]> = new BehaviorSubject<Savebag[]>([]);

  savebagList$: Observable<Savebag[]> = this._savebagListSubject.asObservable();
  chiffreList$: Observable<Savebag[]> = this._chiffreListSubject.asObservable();



   //getAllColis //pagination
 getAllSavebag():Observable<Savebag[]>{
  return this.http.get<Savebag[]>( `${environment.backendHost}/savebag`)
 }

 updateSavebagList(newSavebag: Savebag): void {
  const currentSavebagList = this._savebagListSubject.value;
  this._savebagListSubject.next([...currentSavebagList, newSavebag]);
}

updateChiffreList(newChiffre: Savebag): void {
  const currentChiffreList = this._chiffreListSubject.value;
  this._chiffreListSubject.next([...currentChiffreList, newChiffre]);
}
removeSavebagFromList(savebagToRemove: Savebag): void {
  const currentSavebagList = this._savebagListSubject.value;
  const updatedList = currentSavebagList.filter(item => item !== savebagToRemove);
  this._savebagListSubject.next(updatedList);
}

removeChiffreFromList(chiffreToRemove: Savebag): void {
  const currentChiffreList = this._chiffreListSubject.value;
  const updatedList = currentChiffreList.filter(item => item !== chiffreToRemove);
  this._chiffreListSubject.next(updatedList);
}


 getAllSavebagFiltre<T>(page: number, limit: number, nomCl?: string, nomCom?: string, gov?: string, date?: Date): Observable<PaginatedResponse<T>> {
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
    `${environment.backendHost}/savebag/getAll/${page}/${limit}`,
    { params }
  );
}
 getAllClients(): Observable<string[]> {
  return this.http.get<string[]>(`${environment.backendHost}/colis/clients/all`);
}
  //CreateColis
  creatSavebag(savebag:Savebag): Observable<any> {
    const requestBody = {
      ...savebag
    };

    console.log('Request Payload:', requestBody);

    return this.http.post(`${environment.backendHost}/savebag/create`, requestBody);
  }



  //getColis
getAllCommerciaux():Observable<any>{
  return this.http.get<any>(`${environment.backendHost}/savebag/Com/all`)
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

    `${environment.backendHost}/savebag/chiffresSB/all/${page}/${limit}`,
    { params }
  );
}
//filtre+pagination //ye5i el filter ynajem ya5tar 2kther men we7ed ?
getSavebagFiltre<T>(
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
    `${environment.backendHost}/savebag/getAll/${page}/${limit}`,
    { params }
  );
}
getChiffreById(iC: number): Observable<any[]> {
  const url = `${environment.backendHost}/savebag/chiffreById/${iC}`;
  return this.http.get<any[]>(url);
}

private validerClickedSource = new Subject<void>();

validerClicked$ = this.validerClickedSource.asObservable();

triggerValiderClicked() {
  this.validerClickedSource.next();
}



}
