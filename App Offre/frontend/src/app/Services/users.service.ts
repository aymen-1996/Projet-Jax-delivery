import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';


interface ApiResponse {
  totalItems: number;
  items: User[]; // Assuming that the items property is an array of User
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
export class UsersService {

  constructor(private http: HttpClient) {}



  getAllUser(
    page: number,
    limit: number,
    email?: string,
    active?: string,
  ): Observable<ApiResponse> {
    const params = new HttpParams()
    .set('email', email || '')
    .set('active', active || '')
    return this.http.get<ApiResponse>(
      `${environment.backendHost}/api/getAllUser/${page}/${limit}`,
      { params }
    );
  }
  
  updateActive(id: number): Observable<any> {
    return this.http.put<any>(`${environment.backendHost}/api/${id}/active`, {});
  }

}

