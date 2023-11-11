import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable, tap, of, map, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    // No es recomendable retornar el this.user ya que fuera del servicio se puede acceder o modificar el usuario
    // Es recomendable enviar una copia del objeto, ya sea con {...this.user} o con structuredClone, función nueva de la última versión de Angular
    // structuredClone hace una deep clone (profunda clonación)
    // return this.user;
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<User> {

    // Paso 1 que se hará en un futuro con el backend implementado
    // this.http.post('login', { email, password });

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', 'AS1wyxzvc897asdf9xv.oi8as897fgd89suds.fdgfds6h5gfd6')
        )
      )
  }

  // El observable va a emitir un valor booleano
  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        map(user => Boolean(user)),
        catchError(err => of(false))
      )
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
