import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandComponent } from './sand.component';

describe('SandComponent', () => {
  let component: SandComponent;
  let fixture: ComponentFixture<SandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
