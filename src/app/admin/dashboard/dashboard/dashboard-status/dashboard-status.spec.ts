import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatus } from './dashboard-status';

describe('DashboardStatus', () => {
  let component: DashboardStatus;
  let fixture: ComponentFixture<DashboardStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
