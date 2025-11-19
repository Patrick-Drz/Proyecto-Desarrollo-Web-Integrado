import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOffers } from './admin-offers';

describe('AdminOffers', () => {
  let component: AdminOffers;
  let fixture: ComponentFixture<AdminOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOffers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOffers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
