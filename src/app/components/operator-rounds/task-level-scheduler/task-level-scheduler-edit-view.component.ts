import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { FormService } from 'src/app/forms/services/form.service';
import { State } from 'src/app/state/app.state';
@Component({
  selector: 'app-task-level-scheduling-edit-view',
  template: ``,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskLevelSchedulingEditViewComponent implements OnInit, OnDestroy {
  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private route: ActivatedRoute,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService,
    private cdrf: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {}
}
