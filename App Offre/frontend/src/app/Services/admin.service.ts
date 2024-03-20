import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


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
export class AdminService {

  constructor(private http: HttpClient) { }

  getBlAndFiltrage<T>(
      userId: number,
      page: number,
      limit: number,
      dateBl?: Date,
      matriculeFiscale?: string,
      reference?: string
    ): Observable<PaginatedResponse<T>> {
      const params = new HttpParams()
        .set('dateBl', dateBl ? dateBl.toISOString() : '')
        .set('matriculeFiscale', matriculeFiscale || '')
        .set('reference', reference || '');
  
      return this.http.get<PaginatedResponse<T>>(
        `${environment.backendHost}/bl/allofferes/${page}/${limit}`,
        { params }
      );
    }


    getUserAndFiltrage<T>(
      page: number,
      limit: number,
      email?: string,
      matriculeFiscale?: string,
      name?: string
    ): Observable<PaginatedResponse<T>> {
      const params = new HttpParams()
        .set('email', email || '')
        .set('matriculeFiscale', matriculeFiscale || '')
        .set('name', name || '');
  
      return this.http.get<PaginatedResponse<T>>(
        `${environment.backendHost}/api/getALLUsers/${page}/${limit}`,
        { params }
      );
    }
}
