import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateBlDto } from '../models/CreateBlDto';


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


export class SaveAllService {
  selectedFile!: File;

  constructor(private http: HttpClient) { }


 
  uploadExcelFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.backendHost}/upload-groupe/${id}/upload-excel`, formData);
  }

  getBlByUserIdAndFiltrage<T>(
    userId: number,
    page: number,
    limit: number,
    dateBl?: Date,
    matriculeFiscale?: string,
    reference?: string
  ): Observable<PaginatedResponse<T>> {
    const params = new HttpParams()
      .set('dateBl', dateBl instanceof Date ? dateBl.toISOString() : '')
      .set('matriculeFiscale', matriculeFiscale || '')
      .set('reference', reference || '');
  
    return this.http.get<PaginatedResponse<T>>(
      `${environment.backendHost}/bl/${userId}/getAllBlByUserFilter/${page}/${limit}`,
      { params }
    );
  }
  
  
  
  



  downloadPdf(idBl: number): Observable<any> {
    const url = `${environment.backendHost}/bl/${idBl}/createpdf`;
    return this.http.get(url, { responseType: 'blob' }); // 'blob' responseType for binary data (PDF)
  }

  updateOffre(idBl: CreateBlDto, updateBlDto: CreateBlDto): Observable<any> {
    const body = { matriculeFiscale: updateBlDto }; 

    return this.http.put(`${environment.backendHost}/bl/${idBl.id}`, body)
  }
  findOneById(bl: number): Observable<any> {
    const url = `${environment.backendHost}/bl/${bl}`;
    return this.http.get<any>(url);
  }
 
}
