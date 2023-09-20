import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { dateFormat3, dateFormat4 } from 'src/app/app.constants';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RoundPlanScheduleConfiguration } from 'src/app/interfaces';
import { cloneDeep, isEqual } from 'lodash-es';
import { ConfirmModalPopupComponent } from '../../race-dynamic-form/confirm-modal-popup/confirm-modal-popup/confirm-modal-popup.component';

@Component({
  selector: 'app-scheduler-modal',
  templateUrl: './scheduler-modal.component.html',
  styleUrls: ['./scheduler-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerModalComponent implements OnInit {
  payload: any;
  plantTimezoneMap: any;
  steps: Step[] = [
    { title: 'Header', content: '' },
    { title: 'Tasks', content: '' }
  ];
  totalSteps: number;
  currentStep = 0;
  revisedInfo$: Observable<any>;
  revisedInfo: any;
  isRevised$: Observable<boolean>;
  isRevised: boolean;
  isHeaderLevelConfigChanged = false;
  scheduleConfig: RoundPlanScheduleConfiguration;
  currentScheduleConfig: RoundPlanScheduleConfiguration;

  constructor(
    public dialogRef: MatDialogRef<SchedulerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private operatorRoundService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.operatorRoundService.setRevisedInfo({});
    this.operatorRoundService.setCheckBoxStatus({});
    this.operatorRoundService.setSelectedNode({});
    this.operatorRoundService.setIsRevised(false);
    this.totalSteps = this.steps.length;

    if (Object.keys(this.data.scheduleConfiguration).length) {
      const {
        scheduleType: headerScheduleType,
        shiftDetails: headerShiftDetails,
        scheduleByDates: headerScheduleByDates,
        startDate: headerStartDate,
        endDate: headerEndDate
      } = this.data.scheduleConfiguration;
      this.scheduleConfig = {
        startDate: localToTimezoneDate(
          new Date(headerStartDate),
          this.data.plantTimezoneMap[this.data.roundPlanDetail?.plantId],
          dateFormat3
        ),
        shiftDetails: Object.keys(headerShiftDetails).reduce((acc, curr) => {
          acc[curr] = headerShiftDetails[curr].map((slotInfo) => {
            const { checked, ...slot } = slotInfo;
            return slot;
          });
          return acc;
        }, {}),
        scheduleType: headerScheduleType,
        scheduleByDates: headerScheduleByDates,
        endDate: localToTimezoneDate(
          new Date(headerEndDate),
          this.data.plantTimezoneMap[this.data.roundPlanDetail?.plantId],
          dateFormat3
        )
      } as RoundPlanScheduleConfiguration;
    }
    const uniqueScheduleConfigurations = [];
    const revisedInfo = this.data.scheduleConfiguration.taskLevelConfig
      ? this.data.scheduleConfiguration.taskLevelConfig.reduce((acc, curr) => {
          const {
            nodeWiseQuestionIds,
            nodeWiseAskQuestionIds,
            nodeWiseHideQuestionIds,
            nodeWiseMandateQuestionIds,
            _id,
            scheduledTill,
            ...taskLevelConfig
          } = curr;
          const {
            startDate,
            endDate,
            daysOfWeek,
            monthlyDaysOfWeek,
            repeatDuration,
            repeatEvery,
            scheduleByDates,
            scheduleType,
            shiftDetails
          } = taskLevelConfig;
          const formatedStartDate = localToTimezoneDate(
            new Date(startDate),
            this.data.plantTimezoneMap[this.data.roundPlanDetail?.plantId],
            dateFormat4
          );
          const formatedEndDate = localToTimezoneDate(
            new Date(endDate),
            this.data.plantTimezoneMap[this.data.roundPlanDetail?.plantId],
            dateFormat4
          );
          const startDatePicker = new Date(
            localToTimezoneDate(
              new Date(startDate),
              this.data.plantTimezoneMap[this.data.roundPlanDetail?.plantId],
              dateFormat3
            )
          );
          const endDatePicker = new Date(
            localToTimezoneDate(
              new Date(endDate),
              this.data.plantTimezoneMap[this.data.roundPlanDetail?.plantId],
              dateFormat3
            )
          );
          uniqueScheduleConfigurations.push({
            startDate: formatedStartDate,
            endDate: formatedEndDate,
            startDatePicker,
            endDatePicker,
            daysOfWeek,
            monthlyDaysOfWeek,
            repeatDuration,
            repeatEvery,
            scheduleByDates,
            scheduleType,
            shiftDetails
          });
          for (const [nodeId, questionsIds] of Object.entries(
            nodeWiseQuestionIds as { [key: string]: string[] }
          )) {
            const taskLevelScheduleConfig = questionsIds.reduce(
              (queAcc, queCurr) => {
                queAcc[queCurr] = {
                  ...taskLevelConfig,
                  startDate: formatedStartDate,
                  endDate: formatedEndDate,
                  startDatePicker,
                  endDatePicker
                };
                return queAcc;
              },
              {}
            );
            acc[nodeId] = { ...acc[nodeId], ...taskLevelScheduleConfig };
          }
          return acc;
        }, {})
      : {};
    this.operatorRoundService.setuniqueConfiguration(
      uniqueScheduleConfigurations
    );
    this.operatorRoundService.setRevisedInfo(revisedInfo);

    this.isRevised$ = this.operatorRoundService.isRevised$.pipe(
      tap((revised) => (this.isRevised = revised))
    );
    this.revisedInfo$ = this.operatorRoundService.revisedInfo$.pipe(
      tap((revised) => (this.revisedInfo = revised))
    );
  }

  goBack() {
    if (this.isRevised) {
      const alertDialog = this.dialog.open(AlertModalComponent, {
        height: '142px',
        width: '400px'
      });
      alertDialog.afterClosed().subscribe((res) => {
        if (res) {
          this.operatorRoundService.setRevisedInfo({});
          this.operatorRoundService.setCheckBoxStatus({});
          this.operatorRoundService.setSelectedNode({});
          this.operatorRoundService.setIsRevised(false);
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  onGotoStep(step): void {
    this.currentStep = step;
  }

  gotoNextStep(): void {
    if (
      this.isHeaderLevelConfigChanged &&
      Object.keys(this.revisedInfo).length
    ) {
      const alertDialog = this.dialog.open(ConfirmModalPopupComponent, {
        maxHeight: 'max-content',
        maxWidth: 'max-content',
        data: {
          popupTexts: {
            primaryBtnTaskText: 'Cancel',
            secondaryBtnText: 'Continue to Task Step',
            title: 'Alert',
            subtitle: 'taskLevelAlert',
            note: 'taskLevelNote'
          }
        }
      });
      alertDialog.afterClosed().subscribe((res) => {
        if (res !== 'primary') {
          this.scheduleConfig = cloneDeep(this.currentScheduleConfig);
          this.operatorRoundService.setRevisedInfo({});
          this.currentStep++;
        }
      });
    } else {
      this.currentStep++;
    }
  }

  gotoPreviousStep(): void {
    this.currentStep--;
  }

  payloadEmitter($event: any) {
    const { payload, plantTimezoneMap, scheduleConfig } = $event;
    this.payload = payload;
    this.plantTimezoneMap = plantTimezoneMap;

    if (!this.scheduleConfig) {
      this.scheduleConfig = scheduleConfig;
    } else {
      this.isHeaderLevelConfigChanged = !isEqual(
        scheduleConfig,
        this.scheduleConfig
      );
      if (this.isHeaderLevelConfigChanged) {
        this.currentScheduleConfig = scheduleConfig;
      }
    }
  }
}
