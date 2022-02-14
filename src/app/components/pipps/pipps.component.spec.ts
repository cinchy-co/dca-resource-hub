import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PippsComponent } from './pipps.component';

describe('PippsComponent', () => {
  let component: PippsComponent;
  let fixture: ComponentFixture<PippsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PippsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PippsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
