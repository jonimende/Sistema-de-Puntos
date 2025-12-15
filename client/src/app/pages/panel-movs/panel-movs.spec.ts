import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMovs } from './panel-movs';

describe('PanelMovs', () => {
  let component: PanelMovs;
  let fixture: ComponentFixture<PanelMovs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelMovs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelMovs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
