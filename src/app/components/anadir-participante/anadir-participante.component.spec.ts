import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirParticipanteComponent } from './anadir-participante.component';

describe('AnadirParticipanteComponent', () => {
  let component: AnadirParticipanteComponent;
  let fixture: ComponentFixture<AnadirParticipanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirParticipanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
