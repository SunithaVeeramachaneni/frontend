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
import { dateFormat4 } from 'src/app/app.constants';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map
} from 'rxjs/operators';
import { OperatorRoundsService } from '../services/operator-rounds.service';

import { tap } from 'rxjs/operators';
import { format } from 'date-fns';
import { isEqual } from 'lodash-es';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { RoundPlanScheduleConfiguration } from 'src/app/interfaces/operator-rounds';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

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
    this._payload = payload;
    if (this._payload) {
      this.allSlots = this.prepareShiftAndSlot(
        this._payload.shiftSlots,
        this._payload.shiftDetails
      );
      this.taskLevelScheduleHeaderConfiguration = {
        ...this.taskLevelScheduleHeaderConfiguration,
        assigneeDetails: this._payload.assignmentDetails.displayValue,
        headerStartDate: format(new Date(this._payload.startDate), dateFormat4),
        headerEndDate: format(new Date(this._payload.endDate), dateFormat4),
        headerFrequency:
          this._payload.scheduleType === 'byDate'
            ? 'Custom Dates'
            : `Every ${this._payload.repeatDuration} ${this._payload.repeatEvery}`,
        shiftDetails: this.allSlots,
        slotDetails: this.allSlots,
        slotsCount: this.countOfSlots(this.allSlots)
      };
    }
  }
  get payload() {
    return this._payload;
  }

  status: string;
  taskLevelScheduleHeaderConfiguration;
  searchHierarchyKey: FormControl;
  filteredOptions$: Observable<any[]>;
  flatHierarchy: any;
  authoredData: any;
  pages: any;
  filteredList = [];
  selectedNode = [];
  selectedPages: any;
  selectedNodeId: any;
  mode = 'scheduler';
  isPreviewActive = false;
  checkboxStatus = { status: false };
  nodeIdToNodeName = {};
  pageCheckBoxStatusObject: any = {};
  openCloseRightPanel = false;
  _payload: any;
  scheduleConfig: RoundPlanScheduleConfiguration;
  authorToEmail: any;
  revisedInfo: any;
  displayNodeLevelConfig = new Set();
  displayTaskLevelConfig = new Map();
  allSlots = [];

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
        this.pages = JSON.parse(this.authoredData.subForms);

        Object.keys(this.pages).forEach((pageObj) => {
          this.pages[pageObj].forEach((page) => {
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
        this.operatorRoundService.setAllPageCheckBoxStatus(this.pages);
        this.flatHierarchy = JSON.parse(this.authoredData.flatHierarchy);
        this.flatHierarchy.forEach((node) => {
          this.nodeIdToNodeName[node.id] = node.name;
        });

        this.flatHierarchy = this.flatHierarchy.filter((node) => {
          const page_id = 'pages_' + node['id'].toString();
          try {
            if (this.pages[page_id].length > 0) return true;
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

    this.operatorRoundService.selectedNode$
      .pipe(
        tap((data) => {
          this.selectedNode = data;
          for (const key in this.pages) {
            if (this.pages.hasOwnProperty(key)) {
              const assetLocationId = key.toString().split('_')[1];
              if (assetLocationId === this.selectedNode['id']) {
                this.selectedPages = this.pages[key];
                this.selectedNodeId = assetLocationId;
              }
            }
          }
        })
      )
      .subscribe();
    this.roundPlanData.assigneeDetails.users.forEach((user) => {
      if (
        user.firstName + ' ' + user.lastName ===
        this.roundPlanData.roundPlanDetail.author
      ) {
        this.authorToEmail = user.email;
      }
    });
    this.operatorRoundService.revisedInfo$.subscribe((revisedInfo) => {
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
    });
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
    Object.keys(this.pages).forEach((page_id) => {
      const assetLocationId = page_id.split('_')[1];
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

  prepareShiftSlot(shiftSlotDetail) {
    if (shiftSlotDetail[0].null) {
      return shiftSlotDetail[0];
    } else {
      const shiftData = {};
      shiftSlotDetail.forEach((detail) => {
        shiftData[detail.id] = this.payload.shiftDetails[detail.id];
      });
      return shiftData;
    }
  }

  countOfSlots(slots) {
    let count = 0;
    slots.forEach((slot) => {
      count += slot.payload.length;
    });
    return count;
  }

  prepareTaskLeveConfig(revisedInfo) {
    const taskLevelConfig = [];
    this.operatorRoundService.uniqueConfiguration$.subscribe((configs) => {
      configs.forEach((config) => {
        config['nodeWiseQuestionIds'] = {};
        Object.keys(revisedInfo).forEach((nodeId) => {
          Object.keys(revisedInfo[nodeId]).forEach((questionId) => {
            const questionConfig = revisedInfo[nodeId][questionId];
            if (isEqual(config, questionConfig)) {
              if (!config['nodeWiseQuestionIds'][nodeId])
                config['nodeWiseQuestionIds'][nodeId] = [];
              config['nodeWiseQuestionIds'][nodeId].push(questionId);
            }
          });
        });
        taskLevelConfig.push(config);
      });
    });
    return taskLevelConfig;
  }

  onSchedule() {
    this.scheduleConfig = {
      roundPlanId: this.roundPlanData.roundPlanDetail.id,
      ...this.payload,
      startDate: this.payload.startDate,
      endDate: this.payload.endDate,
      shiftDetails: this.prepareShiftSlot(this.payload.shiftSlots),
      isArchived: false,
      assignmentDetails: this.payload.assignmentDetails,
      advanceRoundsCount: 0,
      createdAt: this.roundPlanData.roundPlanDetail.createdAt,
      updatedAt: this.roundPlanData.roundPlanDetail.updatedAt,
      createdBy: this.authorToEmail,
      _v: 0,
      taskLevelConfig: this.prepareTaskLeveConfig(this.revisedInfo)
    };

    this.scheduleConfig['taskLevelConfig'].filter((config) => {
      if (Object.keys(config.nodeWiseQuestionIds).length === 0) return false;
      return true;
    });
    this.schedulerConfigurationService
      .createRoundPlanScheduleConfiguration$(this.scheduleConfig)
      .subscribe();
  }

  prepareShiftAndSlot(shiftSlot, shiftDetails) {
    if (Object.keys(shiftDetails)[0] === 'null') {
      shiftSlot.forEach((data) => {
        data.payload = shiftDetails.null.map((pLoad) => pLoad);
      });
      return shiftSlot;
    } else {
      shiftSlot.forEach((data) => {
        data.payload = shiftDetails[data.id].map((pLoad) => pLoad);
      });
      return shiftSlot;
    }
  }
}
