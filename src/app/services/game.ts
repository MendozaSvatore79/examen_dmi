import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Game {
  private apiUrl = `${environment.api.baseUrl}${environment.api.gamesSuggestionsPath}`;
  private apiKey = environment.api.apiKey;

  constructor(private http: HttpClient) {}

  getGames(query: string = 'gt', limit: number = 400): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', String(limit))
      .set(environment.api.apiKeyParamName, this.apiKey);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((err) => {
        console.error('Error fetching games', err);
        return of({ results: [] });
      })
    );
  }
}
