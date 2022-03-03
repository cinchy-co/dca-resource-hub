import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyIssuesComponent } from './key-issues.component';

describe('KeyIssuesComponent', () => {
  let component: KeyIssuesComponent;
  let fixture: ComponentFixture<KeyIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
