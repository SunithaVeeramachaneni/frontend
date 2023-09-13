import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Step } from 'src/app/interfaces/stepper';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { dateFormat3, dateFormat4 } from 'src/app/app.constants';

@Component({
  selector: 'app-scheduler-modal',
  templateUrl: './scheduler-modal.component.html',
  styleUrls: ['./scheduler-modal.component.scss']
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

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SchedulerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private operatorRoundService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
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
            if (acc[nodeId]) {
              acc[nodeId] = { ...acc[nodeId], ...taskLevelScheduleConfig };
            } else {
              acc[nodeId] = taskLevelScheduleConfig;
            }
          }
          return acc;
        }, {})
      : {};
    this.operatorRoundService.setuniqueConfiguration(
      uniqueScheduleConfigurations
    );
    this.operatorRoundService.setRevisedInfo(revisedInfo);
  }

  goBack() {
    const alertDialog = this.dialog.open(AlertModalComponent, {
      height: '142px',
      width: '400px'
    });
    alertDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.operatorRoundService.setRevisedInfo({});
        this.router.navigate(['operator-rounds/scheduler/0']);
        this.dialogRef.close();
      }
    });
  }

  onGotoStep(step): void {
    this.currentStep = step;
  }

  gotoNextStep(): void {
    this.currentStep++;
  }

  gotoPreviousStep(): void {
    this.currentStep--;
  }

  payloadEmitter($event: any) {
    const { payload, plantTimezoneMap } = $event;
    this.payload = payload;
    this.plantTimezoneMap = plantTimezoneMap;
  }
}
