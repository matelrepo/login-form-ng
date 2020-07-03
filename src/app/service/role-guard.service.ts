import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (this.auth.user.getValue().isTrader && !this.auth.helper.isTokenExpired(this.auth.jwtToken)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
