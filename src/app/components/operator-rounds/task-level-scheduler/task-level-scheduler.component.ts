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

@Component({
  selector: 'app-task-level-scheduler',
  templateUrl: './task-level-scheduler.component.html',
  styleUrls: ['./task-level-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskLevelSchedulerComponent implements OnInit {
  @Input() roundPlanData: any;
  @Input() set payload(payload: any) {
    this._payload = payload;
    if (this._payload) {
      this.taskLevelScheduleHeaderConfiguration = {
        assigneeDetails: this._payload.assignmentDetails?.displayValue,
        headerStartDate: format(new Date(this._payload.startDate), dateFormat4),
        headerEndDate: format(new Date(this._payload.endDate), dateFormat4),
        headerFrequency: `Every ${this._payload.repeatDuration} ${this._payload.repeatEvery},`,
        shiftDetails: this._payload.shiftSlots,
        slotDetails: this._payload.shiftSlots,
        ...this.taskLevelScheduleHeaderConfiguration
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

  constructor(private operatorRoundService: OperatorRoundsService) {}

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
  }
}
