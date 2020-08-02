import {Injectable} from '@angular/core';
import {User} from '../domain/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {map, tap} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {rxStompConfig} from '../config/rxStompConfig';
import {Router} from '@angular/router';

export const ANONYMOUS_USER: User = {
  id: undefined,
  username: '',
  isTrader: false
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  dst = 'http://localhost:8080'
 // dst = 'https://matel.io:8443'

  user = new BehaviorSubject(ANONYMOUS_USER);
  user$: Observable<User> = this.user.asObservable();
  helper = new JwtHelperService();
  jwtToken = 'jwtToken.a.a';
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.id));


  constructor(private http: HttpClient,
              private rxStompService: RxStompService,
              private router: Router) {
    if (localStorage.getItem('matel-token') != null) {
      this.jwtToken = localStorage.getItem('matel-token')
      if(!this.helper.isTokenExpired(this.jwtToken))
      this.user.next(this.getUser(this.jwtToken));
      this.configWebSocket('Bearer ' + this.jwtToken);
    }
  }

  login(username: string, password: string) {
    return this.http.post<HttpResponse<any>>(this.dst + '/login', {username, password}, {observe: 'response'})
      .pipe(tap(res => {
        this.jwtToken = res.headers.get('authorization').replace('Bearer ', '');
        localStorage.setItem('matel-token', this.jwtToken);
        this.configWebSocket(res.headers.get('authorization'));
        this.user.next(this.getUser(this.jwtToken));
        this.router.navigate(['/panel']);
      }));
  }

  public configWebSocket(token: string) {
    const config = {...rxStompConfig, connectHeaders: {Authorization: token}};
    this.rxStompService.configure(config);
    this.rxStompService.activate();
  }


  public getUser(token: string): User {
    const tokenPayLoad = this.helper.decodeToken(token);
    return {id: tokenPayLoad.id,
      username: tokenPayLoad.sub.charAt(0).toUpperCase() + tokenPayLoad.sub.slice(1),
      isTrader: this.isRoleAuthorized(tokenPayLoad.authorities, "TRADER")};
  }

  logout() {
    this.user.next(ANONYMOUS_USER);
    this.rxStompService.deactivate();
    this.jwtToken = null;
    localStorage.removeItem('matel-token')
    this.router.navigate(['/login']);
  }

  private isRoleAuthorized(authoritiesList: string, expectedRole: string): boolean {
    let list: string[] = authoritiesList.replace(/ /g, '')
      .replace('[', '')
      .replace(']','')
      .split(',')
    expectedRole = "ROLE_" + expectedRole.toUpperCase()

    return list.includes(expectedRole.toUpperCase())
  }

}
