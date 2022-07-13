import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceLocatorComponent } from './resource-locator.component';

describe('ResourceLocatorComponent', () => {
  let component: ResourceLocatorComponent;
  let fixture: ComponentFixture<ResourceLocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceLocatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
