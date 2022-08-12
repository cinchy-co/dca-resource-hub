import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSocialButtonsComponent } from './share-social-buttons.component';

describe('ShareSocialButtonsComponent', () => {
  let component: ShareSocialButtonsComponent;
  let fixture: ComponentFixture<ShareSocialButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareSocialButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSocialButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
