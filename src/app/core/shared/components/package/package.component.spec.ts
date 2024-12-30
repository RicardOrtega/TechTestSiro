import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSelectionComponent } from './package.component';

describe('PackageComponent', () => {
  let component: PackageSelectionComponent;
  let fixture: ComponentFixture<PackageSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
