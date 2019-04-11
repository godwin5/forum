import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesPage } from './likes.page';

describe('LikesPage', () => {
  let component: LikesPage;
  let fixture: ComponentFixture<LikesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
