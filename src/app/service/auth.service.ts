import {Injectable} from '@angular/core';
import {User} from '../config/user';
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
  password: ''
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject(ANONYMOUS_USER);
  user$: Observable<User> = this.user.asObservable();

  helper = new JwtHelperService();
  jwtToken = undefined;
  headers;


  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.id));
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));

  // public getUser(): User {
  //   return this.user.value;
  // }

  notifyNewUser(user: User) {
    console.log('notify new user')
    console.log(user)
    this.user.next(user);
  }

  constructor(private http: HttpClient,
              private rxStompService: RxStompService,
              private router: Router) {

  }

  // register(username: string, password: string) {
  //   const user: User = {id: 0, username: username, password: password, authorities: ''}
  //   return this.http.post('http://localhost:8080/register', user)
  // }

  login(username: string, password: string) {
    // console.log({username, password});
    return this.http.post<HttpResponse<any>>('http://localhost:8080/login', {username, password}, {observe: 'response'})
      .pipe(tap(res => {
        this.jwtToken = res.headers.get('authorization').replace('Bearer ', '');
        const config = {...rxStompConfig, connectHeaders: {Authorization: res.headers.get('authorization')}};
        this.rxStompService.configure(config);
        this.rxStompService.activate();
        console.log(this.jwtToken);
        this.notifyNewUser(this.decodeToken());
        this.router.navigate(['/panel']);
      }));
  }


  public decodeToken(): User {
    const tokenPayLoad = this.helper.decodeToken(this.jwtToken);
    const authoritiesList: string = tokenPayLoad.authorities.replace('[', '').replace(']', '');
    return {
      id: tokenPayLoad.id,
      username: tokenPayLoad.sub.charAt(0).toUpperCase() + tokenPayLoad.sub.slice(1)
    };
  }

  public isLoggedIn(): boolean {
    console.log(this.jwtToken);
    if (this.jwtToken === undefined) {
      return false;
    }

    if (this.jwtToken === null || this.helper.isTokenExpired(this.jwtToken)) {
      return false;
    }
    // Check whether the token is expired and return true or false
    return true;
  }

  logout() {
    this.user.next(ANONYMOUS_USER);
    this.rxStompService.deactivate();
    this.jwtToken = null;
    // this.router.navigate(['/login']);
  }

  // private isRoleAuthorized(authoritiesList: string, expectedRole: string): boolean {
  //   let list: string[] = authoritiesList.replace(/ /g, '').split(',')
  //   expectedRole = "ROLE_" + expectedRole.toUpperCase()
  //   console.log(list)
  //   console.log(expectedRole.toUpperCase())
  //   console.log(list.includes(expectedRole.toUpperCase()))
  //   return list.includes(expectedRole.toUpperCase())
  // }

}
