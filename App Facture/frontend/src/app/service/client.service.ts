import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { client } from '../models/client/client/client';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';


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
export class ClientService {
;


  client!:client ;

  constructor(private http: HttpClient) {
 
    
   }


  

   getallClient<T>(
      page: number,
      limit: number,nomCL?:string
  ):Observable<PaginatedResponse<T>>{
    const params= new HttpParams().set('nomCL',nomCL || '')
  
    return this.http.get<PaginatedResponse<T>>(
      `${environment.backendHost}/client/getAllClient/${page}/${limit}`,
      { params }
    )
  }

  getCommercialClient<T>(
    id:number,
    page: number,
    limit: number,nomCL?:string
):Observable<PaginatedResponse<T>>{
  const params= new HttpParams().set('nomCL',nomCL || '')

  return this.http.get<PaginatedResponse<T>>(
    `${environment.backendHost}/client/user/${id}/getAllByUser/${page}/${limit}`,
    { params }
  )
}

  getClientById(id:number):Observable<client>{
    return this.http.get<any>(`${environment.backendHost}/client/${id}/Client`)
    .pipe(
      map(response => {
        // Assuming the server response is an object with the client data
        const clientData = response as client;
        return clientData;
      }),
      catchError(error => {
        console.error('Error fetching client data:', error);
        throw error; // Rethrow the error to handle it in the calling code
      })
    );
  }

}