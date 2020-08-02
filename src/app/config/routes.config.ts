import {Routes} from '@angular/router';
import {LoginComponent} from '../header/login/login.component';
import {RoleGuardService} from '../service/role-guard.service';
import {PanelComponent} from '../panel/panel.component';
import {EventsListComponent} from "../report/events-list/events-list.component";
import {ExpirationReportComponent} from "../report/expiration-report/expiration-report.component";
import {ContractDetailsComponent} from "../contracts/contract-details/contract-details.component";

export const routesConfig: Routes = [
  {path: 'login', component: LoginComponent },
  // {path: 'register', component: RegisterComponent},
  {path: 'panel', component: PanelComponent, canActivate: [RoleGuardService], data: { expectedRole: 'trader' } },
  {path: 'expiration-report', component: ExpirationReportComponent, canActivate: [RoleGuardService], data: { expectedRole: 'trader' } },
  {path: 'events-list', component: EventsListComponent, canActivate: [RoleGuardService], data: { expectedRole: 'trader' } },
  {path: 'save-contract', component: ContractDetailsComponent, canActivate: [RoleGuardService], data: { expectedRole: 'trader' } },
  {path: '', component: PanelComponent, pathMatch: 'full', canActivate: [RoleGuardService], data: { expectedRole: 'trader' }},
  {path: '**', component: PanelComponent, pathMatch: 'full', canActivate: [RoleGuardService], data: { expectedRole: 'trader' }}
];
