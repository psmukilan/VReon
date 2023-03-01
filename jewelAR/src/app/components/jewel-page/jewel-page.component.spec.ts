import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelPageComponent } from './jewel-page.component';

describe('JewelPageComponent', () => {
  let component: JewelPageComponent;
  let fixture: ComponentFixture<JewelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JewelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
