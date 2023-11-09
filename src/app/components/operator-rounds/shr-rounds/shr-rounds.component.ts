import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { ShiftService } from '../../master-configurations/shifts/services/shift.service';
// import { PlantService } from '../../master-configurations/plants/services/plant.service';
// import { combineLatest } from 'rxjs';
// import { map } from 'rxjs/operators';

type shrRoundFilterSType =
  | 'all'
  | 'overdue'
  | 'submitted'
  | 'skipped'
  | 'open'
  | 'inprogress';
@Component({
  selector: 'app-shr-rounds',
  templateUrl: './shr-rounds.component.html',
  styleUrls: ['./shr-rounds.component.scss']
})
export class ShrRoundsComponent implements OnInit {
  @Input() data: string;
  isLoading$: boolean = false;
  ghostLoading = new Array(10).fill(0).map((v, i) => i);
  commonColumnFeatures = {
    type: 'string',
    controlType: 'string',
    searchable: false,
    sortable: false,
    hideable: false,
    visible: true,
    movable: false,
    stickable: false,
    sticky: false,
    groupable: false,
    titleStyle: {
      'font-weight': '500',
      'font-size': '90%',
      'overflow-wrap': 'anywhere'
    },
    hasSubtitle: false,
    showMenuOptions: false,
    subtitleColumn: '',
    subtitleStyle: {
      'font-size': '80%',
      color: 'darkgray'
    },
    hasPreTextImage: false,
    hasPostTextImage: false
  };
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Round',
      order: 1,
      ...this.commonColumnFeatures,
      sortable: true,
      hasSubtitle: true,
      hasPreTextImage: true,
      subtitleColumn: 'description'
    },
    {
      id: 'status',
      displayName: 'Status',
      order: 2,
      ...this.commonColumnFeatures,
      titleStyle: {
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        width: '80px',
        height: '24px',
        background: 'red',
        color: '#FFFFFF',
        borderRadius: '12px'
      }
    },
    {
      id: 'shiftName',
      displayName: 'Shift',
      order: 3,
      ...this.commonColumnFeatures
    },
    {
      id: 'slotDetails',
      displayName: 'Starts-Ends',
      type: 'string',
      controlType: 'string',
      order: 3,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: false
    },
    {
      id: 'taskCompleted',
      displayName: 'Tasks',
      order: 5,
      ...this.commonColumnFeatures
    },
    {
      id: 'completed',
      displayName: 'Completed',
      order: 5,
      ...this.commonColumnFeatures,
      sortable: true
    },
    {
      id: 'assignedTo',
      displayName: 'Assigned To',
      order: 6,
      ...this.commonColumnFeatures
    }
  ];
  shrRoundsFilterOptions = [
    {
      id: 'all',
      count: 0
    },
    {
      id: 'overdue',
      count: 0
    },
    {
      id: 'submitted',
      count: 0
    },
    {
      id: 'skipped',
      count: 0
    },
    {
      id: 'open',
      count: 0
    },
    {
      id: 'inprogress',
      count: 0
    }
  ];
  shrRoundFilterS: shrRoundFilterSType;
  dataSource: MatTableDataSource<any>;
  allShifts: any = {};
  configOptions: ConfigOptions = {
    tableID: 'shrRoundsTable',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    rowLevelActions: {
      menuActions: []
    },
    allColumns: [],
    groupByColumns: [],
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  constructor(
    private shiftService: ShiftService,
    // private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = true;
    this.shrRoundFilterS = 'overdue'; //default value
    this.configOptions.allColumns = this.columns;
    this.updateFilterCount();
    this.shiftService.fetchAllShifts$().subscribe((res) => {
      res?.items?.map((sft) => {
        this.allShifts[sft?.id] = sft;
        this.updateFilter(this.shrRoundFilterS);
        this.isLoading$ = false;
      });
    });
    // this.plantService.fetchAllPlants$().subscribe((res) => {
    //   console.log(res);
    // });
    // combineLatest([
    //   this.shiftService.fetchAllShifts$(),
    //   this.plantService.fetchAllPlants$()
    // ]).pipe(map(([shifts, plants]) => {}));
  }

  updateFilterCount() {
    (this.data ? JSON.parse(this.data) : []).forEach((round) => {
      this.shrRoundsFilterOptions[0]['count'] =
        this.shrRoundsFilterOptions[0]['count'] + 1;
      if (round?.status === 'overdue') {
        this.shrRoundsFilterOptions[1]['count'] =
          this.shrRoundsFilterOptions[1]['count'] + 1;
      }
      if (round?.status === 'submitted') {
        this.shrRoundsFilterOptions[2]['count'] =
          this.shrRoundsFilterOptions[2]['count'] + 1;
      }
      if (round?.status === 'skipped') {
        this.shrRoundsFilterOptions[3]['count'] =
          this.shrRoundsFilterOptions[3]['count'] + 1;
      }
      if (round?.status === 'open') {
        this.shrRoundsFilterOptions[4]['count'] =
          this.shrRoundsFilterOptions[4]['count'] + 1;
      }
      if (round?.status === 'inprogress') {
        this.shrRoundsFilterOptions[5]['count'] =
          this.shrRoundsFilterOptions[5]['count'] + 1;
      }
    });
  }

  convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':');

    let hours12 = parseInt(hours, 10);
    const suffix = hours12 >= 12 ? 'PM' : 'AM';

    if (hours12 === 0) {
      hours12 = 12;
    } else if (hours12 > 12) {
      hours12 -= 12;
    }

    const time12 = `${hours12}:${minutes} ${suffix}`;
    return time12;
  }

  updateFilter(tab: shrRoundFilterSType) {
    this.shrRoundFilterS = tab;
    const tableData = (this.data ? JSON.parse(this.data) : []).map((val) => {
      let slotObj = JSON.parse(val?.slotDetails || '{}');
      return {
        ...val,
        shiftName: this.allShifts?.[val?.shiftId]?.name || '',
        slotDetails: `${this.convertTo12HourFormat(
          slotObj?.startTime
        )} - ${this.convertTo12HourFormat(slotObj?.endTime)}`,
        completed: Number(val?.taskCount)
          ? `${(Number(val?.taskCompleted) / Number(val?.taskCount)) * 100}%`
          : '--',
        taskCompleted: `${val?.taskCompleted}/${val?.taskCount}`,
        preTextImage: {
          image: '/assets/img/svg/rounds-icon.svg',
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        }
      };
    });
    if (tab === 'all') {
      this.dataSource = new MatTableDataSource(tableData);
    } else {
      this.dataSource = new MatTableDataSource(
        tableData?.filter((value) => value.status === tab)
      );
    }
  }
}
