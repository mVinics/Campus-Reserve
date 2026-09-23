import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<TokenResponse> {
    const credenciais = btoa(`${email}:${senha}`);

    const headers = new HttpHeaders({
      Authorization: `Basic ${credenciais}`
    });

    return this.http.post<TokenResponse>(
      `${this.apiUrl}/auth/token`,
      {},
      { headers }
    );
  }
}