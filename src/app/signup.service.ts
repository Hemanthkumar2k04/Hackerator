import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://localhost:5000'; 
  
  constructor(private http: HttpClient) {}

  signup(username: string, password: string): Observable<string>{

      return this.http.post<string>(`${this.apiUrl}/register`, {username, password});

  }

}
