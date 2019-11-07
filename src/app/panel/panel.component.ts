import { Component, OnInit } from '@angular/core';
import {AuthService} from '../service/auth.service';
import {User} from '../config/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  user: User;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      console.log('panel');
    });
  }

}
