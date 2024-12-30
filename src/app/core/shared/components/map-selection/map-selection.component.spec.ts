import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelectionComponent } from './map-selection.component';

describe('MapSelectionComponent', () => {
  let component: MapSelectionComponent;
  let fixture: ComponentFixture<MapSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
