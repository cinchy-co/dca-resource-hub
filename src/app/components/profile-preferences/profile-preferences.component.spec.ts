import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePreferencesComponent } from './profile-preferences.component';

describe('ProfilePreferencesComponent', () => {
  let component: ProfilePreferencesComponent;
  let fixture: ComponentFixture<ProfilePreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
