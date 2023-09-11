/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  dateFormat4,
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
import { cloneDeep, isEqual } from 'lodash-es';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { RoundPlanScheduleConfiguration } from 'src/app/interfaces/operator-rounds';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { ShiftService } from '../../master-configurations/shifts/services/shift.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { zonedTimeToUtc } from 'date-fns-tz';

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
          width: '30%'
        })
      ),
      //transition('* => *', animate(250))
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
        headerStartDate: format(new Date(payload.startDate), dateFormat4),
        headerEndDate: format(new Date(payload.endDate), dateFormat4),
        headerFrequency:
          payload.scheduleType === 'byDate'
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

  state = 'closed';
  constructor(
    private operatorRoundService: OperatorRoundsService,
    private schedulerConfigurationService: RoundPlanScheduleConfigurationService
  ) {}

  ngOnInit(): void {
    this.searchHierarchyKey = new FormControl('');
    const { name, description } = this.roundPlanData.roundPlanDetail;
    this.taskLevelScheduleHeaderConfiguration = {
      name,
      description
    };

    this.operatorRoundService
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
        this.operatorRoundService.setAllPageCheckBoxStatus(this.subForms);
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

    this.selectedNode$ = this.operatorRoundService.selectedNode$.pipe(
      tap((data) => {
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
    this.revisedInfo$ = this.operatorRoundService.revisedInfo$.pipe(
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

        const revisedInfoNodes = Object.keys(revisedInfo);
        Object.keys(this.subForms).forEach((subFormId) => {
          if (revisedInfoNodes.includes(subFormId.split('_')[1])) {
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
            this.operatorRoundService.setCheckBoxStatus({
              selectedPage: pages,
              nodeId: subFormId.split('_')[1]
            });
          }
          this.operatorRoundService.setCheckBoxStatus({
            selectedPage: this.selectedPages,
            nodeId: this.selectedNodeId
          });
        });
      })
    );
    this.operatorRoundService.uniqueConfiguration$.subscribe(
      (configurations) => {
        this.uniqueConfigurations = configurations;
      }
    );
  }

  filter(value: string): string[] {
    value = value.trim() || '';
    if (!value.length) {
      return [];
    }
    const filteredValue = value.toLowerCase();
    const flatHierarchy = JSON.parse(this.authoredData.flatHierarchy);
    this.filteredList = flatHierarchy.filter(
      (option) =>
        option.name.toLowerCase().includes(filteredValue) ||
        option.nodeDescription?.toLowerCase().includes(filteredValue) ||
        option.nodeId.toLowerCase().includes(filteredValue)
    );
    return this.filteredList;
  }

  searchResultSelected(event) {}

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
        this.selectedPages.forEach((page) => {
          page.complete = checkboxStatus;
          page.partiallyChecked = false;
          page.sections.forEach((section) => {
            section.complete = checkboxStatus;
            section.partiallyChecked = false;
          });
          page.questions.forEach((question) => {
            question.complete = checkboxStatus;
          });
        });
      }
    });
    this.operatorRoundService.setCheckBoxStatus({
      selectedPage: this.selectedPages,
      nodeId: this.selectedNodeId
    });
  }

  openCloseRightPanelEventHandler(event) {
    this.openCloseRightPanel = event;
    this.openCloseRightPanel === true
      ? (this.state = 'open')
      : (this.state = 'closed');
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
        format(scheduleByDate.date, dateTimeFormat3)
      );
      if (
        this.plantTimezoneMap[this.roundPlanData?.plantId]?.timeZoneIdentifier
      ) {
        dateByPlantTimezone = zonedTimeToUtc(
          format(scheduleByDate.date, dateTimeFormat3),
          this.plantTimezoneMap[this.roundPlanData?.plantId]?.timeZoneIdentifier
        );
      }
      return {
        ...scheduleByDate,
        date: dateByPlantTimezone
      };
    });
  }

  prepareTaskLeveConfig(revisedInfo) {
    const taskLevelConfig = [];
    let isQuestionInConfig = false;
    this.uniqueConfigurations.forEach((config) => {
      isQuestionInConfig = false;
      config['nodeWiseQuestionIds'] = {};
      Object.keys(revisedInfo).forEach((nodeId) => {
        Object.keys(revisedInfo[nodeId]).forEach((questionId) => {
          const questionConfig = revisedInfo[nodeId][questionId];
          if (isEqual(config, questionConfig)) {
            if (!config['nodeWiseQuestionIds'][nodeId])
              config['nodeWiseQuestionIds'][nodeId] = [];
            config['nodeWiseQuestionIds'][nodeId].push(questionId);
          }
          if (config['nodeWiseQuestionIds'][nodeId]?.length > 0)
            isQuestionInConfig = true;
        });
      });
      if (isQuestionInConfig) {
        let time = format(new Date(), hourFormat);
        const { startDate, endDate } = config;
        const scheduleByDates =
          config.scheduleType === 'byDate'
            ? this.prepareScheduleByDates(config.scheduleByDates)
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
        taskLevelConfig.push({
          ...config,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleByDates
        });
      }
    });
    return taskLevelConfig;
  }

  onSchedule() {
    const payloadCopy = cloneDeep(this.payload);
    delete payloadCopy.advanceFormsCount;
    delete payloadCopy.formId;
    delete payloadCopy.scheduleEndOccurrencesText;
    delete payloadCopy.shiftSlots;
    delete payloadCopy.shiftsSelected;
    this.scheduleConfig = {
      ...payloadCopy,
      taskLevelConfig: this.prepareTaskLeveConfig(this.revisedInfo)
    };

    this.scheduleConfig['taskLevelConfig'].filter((config) => {
      if (Object.keys(config.nodeWiseQuestionIds).length === 0) return false;
      return true;
    });
    /* console.log(this.scheduleConfig);
    return; */
    this.schedulerConfigurationService
      .createRoundPlanScheduleConfiguration$(this.scheduleConfig)
      .subscribe();
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
