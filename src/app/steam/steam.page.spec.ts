import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteamPage } from './steam.page';

describe('SteamPage', () => {
  let component: SteamPage;
  let fixture: ComponentFixture<SteamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
