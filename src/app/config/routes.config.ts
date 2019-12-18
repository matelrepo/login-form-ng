import {Routes} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {RoleGuardService} from '../service/role-guard.service';
import {PanelComponent} from '../panel/panel.component';
import {PortfolioComponent} from '../portfolio/portfolio.component';

export const routesConfig: Routes = [
  {path: 'login', component: LoginComponent },
  // {path: 'register', component: RegisterComponent},
  {path: 'panel', component: PanelComponent, canActivate: [RoleGuardService], data: { expectedRole: 'trader' } },
  // {path: 'student', component: StudentComponent,canActivate: [RoleGuardService], data: { expectedRole: 'student' } },
  // {path: 'assistant', component: AssistantComponent,canActivate: [RoleGuardService], data: { expectedRole: 'assistant' } },
  {path: '', redirectTo: '/panel', pathMatch: 'full'},
  {path: '**', redirectTo: '/panel', pathMatch: 'full'}
];
