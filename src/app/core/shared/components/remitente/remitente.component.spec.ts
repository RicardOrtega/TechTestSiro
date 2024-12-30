import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitenteComponent } from './remitente.component';

describe('RemitenteComponent', () => {
  let component: RemitenteComponent;
  let fixture: ComponentFixture<RemitenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemitenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemitenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
