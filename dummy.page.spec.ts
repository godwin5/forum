import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyPage } from './dummy.page';

describe('DummyPage', () => {
  let component: DummyPage;
  let fixture: ComponentFixture<DummyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
