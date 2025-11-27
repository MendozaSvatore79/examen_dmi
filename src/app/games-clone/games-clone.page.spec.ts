import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesClonePage } from './games-clone.page';

describe('GamesClonePage', () => {
  let component: GamesClonePage;
  let fixture: ComponentFixture<GamesClonePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesClonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
