import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }


  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroeById(id: string): Observable<Hero | undefined> {
    return this.httpClient.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      )
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&limit=6`);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');
    return this.httpClient.patch<Hero>(`${this.baseUrl}/heroes/${hero.id} `, hero)
  }

  deleteHero(id: string): Observable<boolean> {
    return this.httpClient.delete<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(err => of(false)),
        // map nos permite transformar la respuesta
        map(resp => true)
      )
  }


}
