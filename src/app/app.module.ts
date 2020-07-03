import { MatSliderModule, MatButtonModule, MatBadgeModule, MatButtonToggleModule } from '@angular/material';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TooltipModule} from 'ng2-tooltip-directive';
import {AngularStickyThingsModule} from '@w11k/angular-sticky-things';



import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RxStompService } from '@stomp/ng2-stompjs';
import {JwtInterceptor} from './service/jwtInterceptor';
import { LoginComponent } from './login/login.component';
import {routesConfig} from './config/routes.config';
import { PanelComponent } from './panel/panel.component';
import {RoleGuardService} from './service/role-guard.service';
import { ContractsListComponent } from './contracts-list/contracts-list.component';
import { HeaderComponent } from './header/header.component';
import { ChartComponent } from './chart/chart.component';
import {ChartControlDirective} from './chart/chart-control.directive';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuoteComponent } from './quote/quote.component';
import { LogProcessorDataComponent } from './archives/log-processor-data/log-processor-data.component';
import { PortfolioComponent } from './archives/portfolio/portfolio.component';
import { MacroComponent } from './archives/macro/macro.component';
import { AppRoutingModule } from './app-routing.module';
import { ExpirationReportComponent } from './expiration-report/expiration-report.component';
import { DailyStocksReportComponent } from './daily-stocks-report/daily-stocks-report.component';
import { EventsListComponent } from './events-list/events-list.component';
import { OrderComponent } from './order/order.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelComponent,
    ContractsListComponent,
    HeaderComponent,
    ChartComponent,
    ChartControlDirective,
    ContractDetailsComponent,
    QuoteComponent,
    LogProcessorDataComponent,
    PortfolioComponent,
    MacroComponent,
    ExpirationReportComponent,
    DailyStocksReportComponent,
    EventsListComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routesConfig),
    TooltipModule,
    AngularStickyThingsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatBadgeModule,
    MatButtonToggleModule,
    AppRoutingModule
  ],
  providers: [RoleGuardService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    RxStompService
  ],  bootstrap: [AppComponent]
})
export class AppModule { }
