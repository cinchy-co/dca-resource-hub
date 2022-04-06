import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: RegHomeComponent;
  let fixture: ComponentFixture<RegHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
