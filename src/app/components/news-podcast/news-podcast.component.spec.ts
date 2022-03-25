import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsPodcastComponent } from './news-podcast.component';

describe('NewsPodcastComponent', () => {
  let component: NewsPodcastComponent;
  let fixture: ComponentFixture<NewsPodcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsPodcastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
