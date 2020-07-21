import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStocksReportComponent } from './daily-stocks-report.component';

describe('DailyStocksReportComponent', () => {
  let component: DailyStocksReportComponent;
  let fixture: ComponentFixture<DailyStocksReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStocksReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStocksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
