import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipingDetailsComponent } from './shiping-details.component';

describe('ShipingDetailsComponent', () => {
  let component: ShipingDetailsComponent;
  let fixture: ComponentFixture<ShipingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
