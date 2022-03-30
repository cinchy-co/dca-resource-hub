import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubSidebarComponent } from './hub-sidebar.component';

describe('HubSidebarComponent', () => {
  let component: HubSidebarComponent;
  let fixture: ComponentFixture<HubSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
