import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesTableComponent } from './packages-table.component';

describe('PackagesTableComponent', () => {
  let component: PackagesTableComponent;
  let fixture: ComponentFixture<PackagesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
