import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, UrlSegment, Route, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => console.log({ isAuthenticated })),
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigate(['./auth/login'])
          }
        })
      )
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {

    return this.checkAuthStatus();
    // console.log('canMatch');
    // console.log({ route, segments });
    // return true;
    // throw new Error('Method not implemented')
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAuthStatus();
    // console.log('canActivate');
    // console.log({ route, state });
    // return true;
    // throw new Error('Method not implemented')
  }



}
