import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByAutocompleteComponent } from './search-by-autocomplete.component';

describe('SearchByAutocompleteComponent', () => {
  let component: SearchByAutocompleteComponent;
  let fixture: ComponentFixture<SearchByAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchByAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
