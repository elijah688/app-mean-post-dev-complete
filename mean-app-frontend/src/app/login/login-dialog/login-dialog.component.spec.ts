import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogueComponent } from './login-dialogue.component';

describe('LoginDialogueComponent', () => {
  let component: LoginDialogueComponent;
  let fixture: ComponentFixture<LoginDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
