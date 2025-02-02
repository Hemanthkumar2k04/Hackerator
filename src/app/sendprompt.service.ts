import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendpromptService {
  server_url = 'http://localhost:5000';
  
  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(`${this.server_url}/generate`, { prompt });
  }
}
