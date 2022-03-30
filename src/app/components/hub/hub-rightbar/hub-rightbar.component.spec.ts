import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubRightbarComponent } from './hub-rightbar.component';

describe('HubRightbarComponent', () => {
  let component: HubRightbarComponent;
  let fixture: ComponentFixture<HubRightbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubRightbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubRightbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
