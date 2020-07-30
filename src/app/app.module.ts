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
import { LoginComponent } from './header/login/login.component';
import {routesConfig} from './config/routes.config';
import { PanelComponent } from './panel/panel.component';
import {RoleGuardService} from './service/role-guard.service';
import { ContractsListComponent } from './contracts/contracts-list/contracts-list.component';
import { HeaderComponent } from './header/header.component';
import { ChartComponent } from './chart/chart/chart.component';
import {ChartControlDirective} from './chart/chart-control.directive';
import { ContractDetailsComponent } from './contracts/contract-details/contract-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuoteComponent } from './quote/quote.component';
import { PortfolioComponent } from './trading/portfolio/portfolio.component';
import { MacroComponent } from './archives/macro/macro.component';
import { AppRoutingModule } from './app-routing.module';
import { ExpirationReportComponent } from './report/expiration-report/expiration-report.component';
import { DailyStocksReportComponent } from './report/daily-stocks-report/daily-stocks-report.component';
import { EventsListComponent } from './report/events-list/events-list.component';
import { OrderComponent } from './trading/order/order.component';
import { OrderListComponent } from './trading/order-list/order-list.component';
import { ChartPanelComponent } from './chart/chart-panel/chart-panel.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { AbsolutePipe } from './utils/absolute.pipe';



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
    PortfolioComponent,
    MacroComponent,
    ExpirationReportComponent,
    DailyStocksReportComponent,
    EventsListComponent,
    OrderComponent,
    OrderListComponent,
    ChartPanelComponent,
    AbsolutePipe
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
    AppRoutingModule,
    NgxPaginationModule
  ],
  providers: [RoleGuardService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    RxStompService
  ],  bootstrap: [AppComponent]
})
export class AppModule { }
