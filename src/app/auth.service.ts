import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; 

  constructor(private http: HttpClient) {}


  login(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, { username, password }) ;
  }


  logout(): void {
    localStorage.removeItem('username'); 
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('username'); 
  }

  resetPassword(username: string, oldPassword: string, newPassword: string){
    return this.http.post<string>(`${this.apiUrl}/resetPassword`, {username, oldPassword, newPassword});
  }

  loadUserCredits(username: string): Observable<number>{
    return this.http.get<{credits: number}>(`${this.apiUrl}/get-credits/${username}`).pipe(
      map(response => response.credits)
    );
  }

  UpdateUserCredits(username: string, credits: number): Observable<string>{
    return this.http.patch<string>(`${this.apiUrl}/updateCredits`, {username, credits});
  }

}
