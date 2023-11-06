/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  dateFormat5,
  dateTimeFormat3,
  hourFormat
} from 'src/app/app.constants';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map
} from 'rxjs/operators';
import { OperatorRoundsService } from '../services/operator-rounds.service';

import { tap } from 'rxjs/operators';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash-es';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { RoundPlanScheduleConfiguration } from 'src/app/interfaces/operator-rounds';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ScheduleSuccessModalComponent } from 'src/app/forms/components/schedular/schedule-success-modal/schedule-success-modal.component';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';
import { ScheduleConfigurationComponent } from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.component';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { scheduleConfigs } from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import { ErrorInfo } from 'src/app/interfaces';
import { ErrorHandlerService } from 'src/app/shared/error-handler/error-handler.service';

@Component({
  selector: 'app-task-level-scheduler',
  templateUrl: './task-level-scheduler.component.html',
  styleUrls: ['./task-level-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('widthGrow', [
      state(
        'closed',
        style({
          width: '0%'
        })
      ),
      state(
        'open',
        style({
          width: '25%'
        })
      ),
      transition('* => *', animate('0.4s linear'))
    ])
  ]
})
export class TaskLevelSchedulerComponent implements OnInit {
  @Input() roundPlanData: any;
  @Input() set payload(payload: any) {
    if (payload) {
      this._payload = payload;
      this.allSlots = this.prepareShiftAndSlot(
        payload.shiftSlots,
        payload.shiftDetails
      );
      this.taskLevelScheduleHeaderConfiguration = {
        ...this.taskLevelScheduleHeaderConfiguration,
        assigneeDetails: payload.assignmentDetails.displayValue,
        headerStartDate: payload.startDate,
        headerEndDate: payload.endDate,
        headerFrequency:
          payload.scheduleType === scheduleConfigs.scheduleTypes[1]
            ? 'Custom Dates'
            : `Every ${payload.repeatDuration} ${payload.repeatEvery}`,
        shiftDetails: this.allSlots,
        slotDetails: this.allSlots,
        slotsCount: this.countOfSlots(this.allSlots)
      };
    }
  }
  get payload() {
    return this._payload;
  }

  @Input() set plantTimezoneMap(plantTimezoneMap: any) {
    this._plantTimezoneMap = plantTimezoneMap;
  }

  get plantTimezoneMap() {
    return this._plantTimezoneMap;
  }

  status: string;
  taskLevelScheduleHeaderConfiguration;
  searchHierarchyKey: FormControl;
  filteredOptions$: Observable<any[]>;
  selectedNode$: Observable<any>;
  flatHierarchy: any;
  authoredData: any;
  subForms: any = {};
  filteredList = [];
  selectedNode = [];
  selectedPages: any = [];
  selectedNodeId: any;
  mode = 'scheduler';
  isFormModule = false;
  isPreviewActive = false;
  checkboxStatus = { status: false };
  nodeIdToNodeName = {};
  pageCheckBoxStatusObject: any = {};
  openCloseRightPanel = false;
  _payload: any;
  _plantTimezoneMap: any;
  scheduleConfig: RoundPlanScheduleConfiguration;
  authorToEmail: any;
  revisedInfo: any;
  revisedInfo$: Observable<any>;
  displayNodeLevelConfig = new Set();
  displayTaskLevelConfig = new Map();
  allSlots = [];
  uniqueConfigurations = [];
  uniqueConfiguration$: Observable<any>;
  state = 'closed';
  isThirdPanelOpen = false;
  disableSchedule = false;
  readonly scheduleConfigs = scheduleConfigs;

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private schedulerConfigurationService: RoundPlanScheduleConfigurationService,
    private dialog: MatDialog,
    private readonly scheduleConfigurationService: ScheduleConfigurationService,
    private dialogRef: MatDialogRef<ScheduleConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assetHierarchyUtil: AssetHierarchyUtil,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.searchHierarchyKey = new FormControl('');
    const { name, description } = this.roundPlanData.roundPlanDetail;
    this.taskLevelScheduleHeaderConfiguration = {
      name,
      description
    };

    this.operatorRoundsService
      .getAuthoredFormDetailByFormId$(
        this.roundPlanData.roundPlanDetail.id,
        'Published'
      )
      .subscribe((data) => {
        this.authoredData = data;
        this.subForms = JSON.parse(this.authoredData.subForms);
        Object.keys(this.subForms).forEach((subFormId) => {
          this.subForms[subFormId].forEach((page) => {
            page.complete = false;
            page.partiallyChecked = false;
            page.isOpen = false;
            page.sections.forEach((section) => {
              section.isOpen = false;
              section.partiallyChecked = false;
              section.complete = false;
            });
            page.questions.forEach((question) => {
              question.complete = false;
            });
          });
        });
        this.operatorRoundsService.setAllPageCheckBoxStatus(this.subForms);
        this.flatHierarchy = JSON.parse(this.authoredData.flatHierarchy);
        this.flatHierarchy.forEach((node) => {
          this.nodeIdToNodeName[node.id] = node.name;
        });

        this.flatHierarchy = this.flatHierarchy.filter((node) => {
          const subFormId = 'pages_' + node['id'].toString();
          try {
            if (this.subForms[subFormId].length > 0) return true;
            else return false;
          } catch (err) {
            return false;
          }
        });
      });

    this.filteredOptions$ = this.searchHierarchyKey.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      map((value) => this.filter(value.trim() || ''))
    );

    this.selectedNode$ = this.operatorRoundsService.selectedNode$.pipe(
      tap((data) => {
        if (data && Object.keys(data).length) {
          this.selectedNode = data;
          Object.keys(this.subForms).forEach((subFormId) => {
            const assetLocationId = subFormId.split('_')[1];
            if (assetLocationId === this.selectedNode['id']) {
              this.selectedPages = this.subForms[subFormId].map((page) => {
                page.isOpen = true;
                page.sections.forEach((section) => {
                  section.isOpen = true;
                });
                page.questions.forEach((question) => {
                  question.isOpen = true;
                });
                return page;
              });
              this.selectedNodeId = assetLocationId;
            }
          });
        }
      })
    );

    this.roundPlanData.assigneeDetails.users.forEach((user) => {
      if (
        user.firstName + ' ' + user.lastName ===
        this.roundPlanData.roundPlanDetail.author
      ) {
        this.authorToEmail = user.email;
      }
    });
    this.revisedInfo$ = this.operatorRoundsService.revisedInfo$.pipe(
      tap((revisedInfo) => {
        this.revisedInfo = revisedInfo;
        this.displayTaskLevelConfig.clear();
        this.displayNodeLevelConfig.clear();
        Object.keys(revisedInfo).forEach((nodeId) => {
          this.displayNodeLevelConfig.add(nodeId);
        });
        Object.values(revisedInfo).forEach((config) => {
          Object.keys(config).forEach((questionId) => {
            this.displayTaskLevelConfig.set(questionId, config[questionId]);
          });
        });

        this.resetTaskLevelConfigurationSelections();
      })
    );
    this.uniqueConfiguration$ =
      this.operatorRoundsService.uniqueConfiguration$.pipe(
        tap((configurations) => {
          this.uniqueConfigurations = configurations;
        })
      );
  }

  filter(value: string): string[] {
    value = value.trim() || '';
    if (!value.length) {
      return [];
    }
    const filteredValue = value.toLowerCase();
    const hierarchyClone = JSON.parse(this.authoredData.flatHierarchy);
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      hierarchyClone,
      0
    );
    this.filteredList = flatHierarchy.filter(
      (option) =>
        option.name.toLowerCase().includes(filteredValue) ||
        option.nodeDescription?.toLowerCase().includes(filteredValue) ||
        option.nodeId.toLowerCase().includes(filteredValue)
    );
    return this.filteredList;
  }

  resetTaskLevelConfigurationSelections() {
    Object.keys(this.subForms).forEach((subFormId) => {
      const pages = this.subForms[subFormId].map((page) => {
        page.complete = false;
        page.partiallyChecked = false;
        page.sections.forEach((section) => {
          section.complete = false;
          section.partiallyChecked = false;
        });
        page.questions.forEach((question) => {
          question.complete = false;
        });
        return page;
      });
      if (this.selectedNodeId === subFormId.split('_')[1]) {
        this.selectedPages = pages;
      }
      this.operatorRoundsService.setCheckBoxStatus({
        selectedPage: pages,
        nodeId: subFormId.split('_')[1]
      });
      this.openCloseRightPanelEventHandler(false);
    });
  }

  searchResultSelected(event) {
    const node = event.option.value;
    const el = document.getElementById(`node-${node.id}`);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    if (node) {
      setTimeout(() => {
        this.searchHierarchyKey.patchValue(node.name);
      }, 0);
      this.operatorRoundsService.setSelectedNode(node);
    }
  }

  getSearchMatchesLabel() {
    return `${this.filteredList.length} Search matches`;
  }

  clearSearchResults() {
    this.searchHierarchyKey.patchValue('');
  }

  toggleCheckboxEvent(checkStatus) {
    const checkboxStatus = checkStatus[0];
    this.openCloseRightPanelEventHandler(checkboxStatus);
    const nodeId = checkStatus[1]['id'];
    if (this.openCloseRightPanel === false) this.openCloseRightPanel = true;
    Object.keys(this.subForms).forEach((subFormId) => {
      const assetLocationId = subFormId.split('_')[1];
      if (assetLocationId === nodeId) {
        this.selectedPages = this.selectedPages.map((page) => {
          page.complete = checkboxStatus;
          page.partiallyChecked = false;
          page.sections.forEach((section) => {
            section.complete = checkboxStatus;
            section.partiallyChecked = false;
          });
          page.questions.forEach((question) => {
            question.complete = checkboxStatus;
          });
          return page;
        });
      }
    });
    this.operatorRoundsService.setCheckBoxStatus({
      selectedPage: this.selectedPages,
      nodeId: this.selectedNodeId
    });
  }

  openCloseRightPanelEventHandler(event) {
    this.openCloseRightPanel = event;
    this.isThirdPanelOpen = event;
    if (this.openCloseRightPanel === true) {
      this.state = 'open';
    } else {
      this.state = 'closed';
    }
  }

  resetTaskLevelConfigurationSelectionsHandler(reset: boolean) {
    if (reset) {
      this.resetTaskLevelConfigurationSelections();
    }
  }

  countOfSlots(slots) {
    let count = 0;
    slots.forEach((slot) => {
      count += slot.payload.length;
    });
    return count;
  }

  prepareScheduleByDates(scheduleByDates) {
    return scheduleByDates.map((scheduleByDate) => {
      let dateByPlantTimezone = new Date(
        format(new Date(scheduleByDate.date), dateTimeFormat3)
      );
      if (
        this.plantTimezoneMap[this.roundPlanData.roundPlanDetail.plantId]
          ?.timeZoneIdentifier
      ) {
        dateByPlantTimezone = zonedTimeToUtc(
          format(new Date(scheduleByDate.date), dateTimeFormat3),
          this.plantTimezoneMap[this.roundPlanData.roundPlanDetail.plantId]
            ?.timeZoneIdentifier
        );
      }
      return {
        ...scheduleByDate,
        date: dateByPlantTimezone
      };
    });
  }

  openScheduleSuccessModal(dialogMode: 'create' | 'update') {
    const dialogRef = this.dialog.open(ScheduleSuccessModalComponent, {
      disableClose: true,
      width: '354px',
      height: 'max-content',
      backdropClass: 'schedule-success-modal',
      data: {
        name: this.roundPlanData?.roundPlanDetail?.name ?? '',
        mode: dialogMode,
        isFormModule: this.isFormModule
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data?.redirect) {
          this.scheduleConfigurationService.scheduleConfigEvent.next({
            slideInOut: 'out',
            viewRounds: true,
            actionType: 'scheduleConfigEvent'
          });
        } else {
          this.scheduleConfigurationService.scheduleConfigEvent.next({
            slideInOut: 'out',
            mode: data?.mode,
            actionType: 'scheduleConfigEvent'
          });
        }
      }
    });
  }

  prepareTaskLeveConfig(revisedInfo) {
    const taskLevelConfig = [];
    let isQuestionInConfig = false;
    this.uniqueConfigurations.forEach((config) => {
      isQuestionInConfig = false;
      const taskConfig = { ...config, nodeWiseQuestionIds: {} };
      Object.keys(revisedInfo).forEach((nodeId) => {
        Object.keys(revisedInfo[nodeId]).forEach((questionId) => {
          const questionConfig = revisedInfo[nodeId][questionId];
          if (
            this.operatorRoundsService.comapreConfigurations(
              config,
              questionConfig
            )
          ) {
            if (!taskConfig['nodeWiseQuestionIds'][nodeId])
              taskConfig['nodeWiseQuestionIds'][nodeId] = [];
            taskConfig['nodeWiseQuestionIds'][nodeId].push(questionId);
          }
          if (taskConfig['nodeWiseQuestionIds'][nodeId]?.length > 0)
            isQuestionInConfig = true;
        });
      });
      if (isQuestionInConfig) {
        let time = format(new Date(), hourFormat);
        const { startDate, endDate } = taskConfig;
        const scheduleByDates =
          taskConfig.scheduleType === scheduleConfigs.scheduleTypes[1]
            ? this.prepareScheduleByDates(taskConfig.scheduleByDates)
            : [];

        let startDateByPlantTimezone = new Date(
          `${startDate} ${time}`
        ).toISOString();
        let endDateByPlantTimezone = new Date(
          `${endDate} ${time}`
        ).toISOString();

        if (
          this.plantTimezoneMap[this.roundPlanData?.plantId]?.timeZoneIdentifier
        ) {
          time = localToTimezoneDate(
            new Date(),
            this.plantTimezoneMap[this.roundPlanData?.plantId],
            hourFormat
          );

          startDateByPlantTimezone = zonedTimeToUtc(
            format(new Date(startDate), dateFormat5) + ` ${time}`,
            this.plantTimezoneMap[this.roundPlanData?.plantId]
              ?.timeZoneIdentifier
          ).toISOString();

          endDateByPlantTimezone = zonedTimeToUtc(
            format(new Date(endDate), dateFormat5) + ` ${time}`,
            this.plantTimezoneMap[this.roundPlanData?.plantId]
              ?.timeZoneIdentifier
          ).toISOString();
        }

        const nodeWiseAskQuestionIds = {};
        const nodeWiseMandateQuestionIds = {};
        const nodeWiseHideQuestionIds = {};
        Object.keys(taskConfig.nodeWiseQuestionIds).forEach((nodeId) => {
          taskConfig.nodeWiseQuestionIds[nodeId].forEach((questionId) => {
            this.subForms[`pages_${nodeId}`].forEach((page) => {
              page.logics.forEach((logic) => {
                if (logic.questionId === questionId) {
                  const askQuestionIds = page.questions
                    .map((question) => {
                      if (question.sectionId === `AQ_${logic.id}`) {
                        return question.id;
                      }
                    })
                    .filter((id) => id);

                  if (askQuestionIds.length) {
                    nodeWiseAskQuestionIds[nodeId] = askQuestionIds;
                  }
                  if (logic.action === 'MANDATE') {
                    nodeWiseMandateQuestionIds[nodeId] = logic.mandateQuestions;
                  }
                  if (logic.action === 'HIDE') {
                    nodeWiseHideQuestionIds[nodeId] = logic.hideQuestions;
                  }
                }
              });
            });
          });
        });

        taskLevelConfig.push({
          ...taskConfig,
          nodeWiseAskQuestionIds,
          nodeWiseMandateQuestionIds,
          nodeWiseHideQuestionIds,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleByDates
        });
      }
    });
    return taskLevelConfig;
  }

  prepareShiftDetails(shiftDetails) {
    return Object.keys(shiftDetails).reduce((acc, curr) => {
      acc[curr] = shiftDetails[curr].map((shiftData) => ({
        ...shiftData,
        checked: true
      }));
      return acc;
    }, {});
  }

  onSchedule() {
    this.payload = {
      ...this.payload,
      scheduleByDates: this.payload.scheduleByDates.map((scheduleByDate) => {
        let dateByPlantTimezone = new Date(
          format(new Date(scheduleByDate.date), dateTimeFormat3)
        );
        if (
          this.plantTimezoneMap[this.roundPlanData.roundPlanDetail.plantId]
            ?.timeZoneIdentifier
        ) {
          dateByPlantTimezone = zonedTimeToUtc(
            format(new Date(scheduleByDate.date), dateTimeFormat3),
            this.plantTimezoneMap[this.roundPlanData.roundPlanDetail.plantId]
              ?.timeZoneIdentifier
          );
        }
        return {
          ...scheduleByDate,
          date: dateByPlantTimezone
        };
      })
    };
    const payloadCopy = cloneDeep(this.payload);
    delete payloadCopy.advanceFormsCount;
    delete payloadCopy.formId;
    delete payloadCopy.scheduleEndOccurrencesText;
    delete payloadCopy.shiftSlots;
    delete payloadCopy.shiftsSelected;
    this.scheduleConfig = {
      ...payloadCopy,
      shiftDetails: this.prepareShiftDetails(payloadCopy.shiftDetails),
      taskLevelConfig: this.prepareTaskLeveConfig(this.revisedInfo),
      isTaskLevel: true
    };

    this.scheduleConfig['taskLevelConfig'].filter((config) => {
      if (Object.keys(config.nodeWiseQuestionIds).length === 0) return false;
      return true;
    });

    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };

    if (this.scheduleConfig.id) {
      this.disableSchedule = true;
      this.openScheduleSuccessModal('update');
      this.operatorRoundsService.setScheduleStatus('loading');
      this.schedulerConfigurationService
        .updateRoundPlanScheduleConfiguration$(
          this.scheduleConfig.id,
          this.scheduleConfig,
          info
        )
        .pipe(
          tap((scheduleConfig) => {
            this.disableSchedule = false;
            if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
              this.dialogRef.close({
                roundPlanScheduleConfiguration: scheduleConfig,
                mode: 'update',
                actionType: 'scheduleConfig'
              });
              this.operatorRoundsService.setScheduleStatus('scheduled');
            }
          })
        )
        .subscribe({
          error: (error) => {
            this.operatorRoundsService.setScheduleError(
              this.errorHandlerService.getErrorMessage(error)
            );
            this.operatorRoundsService.setScheduleStatus('failed');
            this.dialogRef.close({
              roundPlanScheduleConfiguration: this.scheduleConfig,
              mode: 'update',
              actionType: 'scheduleFailure'
            });
          }
        });
    } else {
      this.disableSchedule = true;
      this.openScheduleSuccessModal('create');
      this.operatorRoundsService.setScheduleStatus('loading');
      this.schedulerConfigurationService
        .createRoundPlanScheduleConfiguration$(this.scheduleConfig, info)
        .pipe(
          tap((scheduleConfig) => {
            this.disableSchedule = false;
            if (scheduleConfig && Object.keys(scheduleConfig).length) {
              this.dialogRef.close({
                roundPlanScheduleConfiguration: scheduleConfig,
                mode: 'create',
                actionType: 'scheduleConfig'
              });
              this.payload.id = scheduleConfig.id;
              this.operatorRoundsService.setScheduleStatus('scheduled');
            }
          })
        )
        .subscribe({
          error: (error) => {
            this.operatorRoundsService.setScheduleError(
              this.errorHandlerService.getErrorMessage(error)
            );
            this.operatorRoundsService.setScheduleStatus('failed');
            this.dialogRef.close({
              roundPlanScheduleConfiguration: this.scheduleConfig,
              mode: 'create',
              actionType: 'scheduleFailure'
            });
          }
        });
    }
  }

  prepareShiftAndSlot(shiftSlot, shiftDetails) {
    let shifSlots = [];
    if (Object.keys(shiftDetails)[0] === 'null') {
      shifSlots = shiftSlot.map((data) => ({
        ...data,
        payload: shiftDetails.null.map((pLoad) => pLoad)
      }));
      return shifSlots;
    } else {
      shifSlots = shiftSlot.map((data) => ({
        ...data,
        payload: shiftDetails[data.id].map((pLoad) => pLoad)
      }));
      return shifSlots;
    }
  }
}
