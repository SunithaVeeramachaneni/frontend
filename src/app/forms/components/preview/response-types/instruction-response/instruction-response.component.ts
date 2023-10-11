import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  State,
  getModuleName,
  selectQuestionInstuctionsMediaMap
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Question, QuestionPageIndexNodeMap } from 'src/app/interfaces';

@Component({
  selector: 'app-instruction-response',
  templateUrl: './instruction-response.component.html',
  styleUrls: ['./instruction-response.component.scss']
})
export class InstructionResponseComponent implements OnInit {
  @Input() question: QuestionPageIndexNodeMap;
  moduleName: string;
  instructionsMedia: any;
  instructionsMedia$: Observable<any>;
  private onDestroy$ = new Subject();

  constructor(
    private translate: TranslateService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.store.select(getModuleName).subscribe((moduleName) => {
      this.moduleName = moduleName;
    });

    this.instructionsMedia$ = this.store.select(
      selectQuestionInstuctionsMediaMap(
        this.question.subFormId,
        this.question.id,
        this.question.pageIndex - 1
      )
    );
  }

  getNoneTag() {
    return this.translate.instant('noneTag');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
