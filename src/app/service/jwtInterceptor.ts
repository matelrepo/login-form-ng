import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import { finalize, tap } from 'rxjs/operators';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req)
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.jwtToken}`
      }
    });
    return next.handle(req);
  }
}
