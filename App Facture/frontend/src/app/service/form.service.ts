import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

import { EmailInfo } from '../models/client/client/EmailInfo';
import { client } from '../models/client/client/client';
import { facture } from '../models/Doc/facteur/facteur';




@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) {}
 
  createClientByUser(idUser: any, client: client): Observable<any> {
    const requestBody = {
      ...client
    };
  
    console.log('Request Payload:', requestBody);
  
    return this.http.post(`${environment.backendHost}/client/user/${idUser}`, requestBody);
  }

  createClientByAdmin(idUser: any, client: client): Observable<any> {
    const requestBody = {
      ...client
    };
  
    console.log('Request Payload:', requestBody);
  
    return this.http.post(`${environment.backendHost}/client/admin/${idUser}`, requestBody);
  }
  
  

  createFacteure(idUser:any ,facture:facture): Observable<any>{
    const  requestabaody={
      ...facture 
    }
    console.log('Request Payload:',requestabaody);
    return this.http.post(`${environment.backendHost}/fact/${idUser}`, requestabaody)

  }
  
  generateFactureNumber(id: number): Observable<{ factureNumber: string }> {
    const url =` ${environment.backendHost}/fact/generateFactureNumber/${id}`;
    return this.http.get<{ factureNumber: string }>(url);
  }
  
  

downloadPdf(factId: number): Observable<Blob> {
  return this.http.get(`${environment.backendHost}/fact/${factId}/Pdf`, {
    responseType: 'blob',
  });
}

generatePdf(): void {
  const downloadUrl = `${environment.backendHost}/upload-groupe/download`;
  window.open(downloadUrl, '_blank');
}





}