import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const SERVICE_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class DataNodeService {
  httpOptions = {
    headers: new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(`${SERVICE_URL}/data`);
  }

  post(data): Observable<Response> {
    return this.http.post<Response>(`${SERVICE_URL}/data`, data, this.httpOptions);
  }
}
