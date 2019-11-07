import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // const expectedRole = route.data.expectedRole;

    // if (expectedRole === "assistant" && this.auth.getUser().isAssistant) return true;
    // if (expectedRole === "trader" && this.auth.getUser().isTrader) return true;
    // if (expectedRole === "student" && this.auth.getUser().isStudent) return true;
    console.log(this.auth.isLoggedIn());
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }

  }
}
