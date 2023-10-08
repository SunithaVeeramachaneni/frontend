import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import {
  State,
  getModuleName
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-instruction-response',
  templateUrl: './instruction-response.component.html',
  styleUrls: ['./instruction-response.component.scss']
})
export class InstructionResponseComponent implements OnInit {
  @Input() question: Question;
  moduleName: string;
  instructionsMedia$: BehaviorSubject<any>;
  onDestroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private rdfService: RaceDynamicFormService,
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.store.select(getModuleName).subscribe((moduleName) => {
      this.moduleName = moduleName;

      this.instructionsMedia$ =
        moduleName === 'RDF'
          ? this.rdfService.questionInstructionMediaMap$
          : this.operatorRoundsService.questionInstructionMediaMap$;
    });
  }

  getNoneTag() {
    return this.translate.instant('noneTag');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
