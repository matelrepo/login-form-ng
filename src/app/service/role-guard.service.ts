import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(!this.auth.helper.isTokenExpired(this.auth.jwtToken)) {
      if (this.auth.user.getValue().isTrader) {
        return true;
      } else {
        this.router.navigate(['/login/1']); //why 1????
        return false;
      }
    }else{
      this.auth.logout();
      return false
    }
  }
}
