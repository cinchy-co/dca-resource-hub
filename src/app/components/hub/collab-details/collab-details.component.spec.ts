import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabDetailsComponent } from './collab-details.component';

describe('CollabDetailsComponent', () => {
  let component: CollabDetailsComponent;
  let fixture: ComponentFixture<CollabDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollabDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
