import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil
} from 'rxjs/operators';

import { HierarchyEntity } from 'src/app/interfaces';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hierarchy-locations-list',
  templateUrl: './hierarchy-locations-list.component.html',
  styleUrls: ['./hierarchy-locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyLocationsListComponent implements OnInit, OnDestroy {
  @Output() handleLocationHierarchy: EventEmitter<any> =
    new EventEmitter<any>();
  @Input() set locationsData(data: HierarchyEntity[]) {
    this.allItems = data
      ? JSON.parse(
          JSON.stringify(data.filter((item) => item.type === 'location'))
        )
      : ([] as HierarchyEntity[]);

    this.searchFilterItems = this.allItems;
    this.cdrf.markForCheck();
  }
  @Input() set selectedList(data) {
    this.selectedHierarchyList = data;
  }
  allLocations: HierarchyEntity[];
  selectedHierarchyList: HierarchyEntity[];
  public isMasterChecked: boolean;
  public isMasterCheckedData: any = {
    checked: false,
    masterToggle: false
  };
  public searchLocations: FormControl;
  public selectedItems = [] as HierarchyEntity[];
  public allItems = [];
  public searchFilterItems = [];
  public initialSelectedItems = [] as HierarchyEntity[];
  private onDestroy$ = new Subject();

  constructor(
    private dialogRef: MatDialogRef<HierarchyLocationsListComponent>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isMasterChecked = false;
    this.searchLocations = new FormControl('');
    this.searchLocations.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        map((searchInput: string) => {
          this.searchFilterItems = this.allItems.filter(
            (item: HierarchyEntity) => {
              searchInput = searchInput?.toLowerCase().trim() || '';
              return (
                item.name.toLowerCase().trim().includes(searchInput) ||
                item?.nodeDescription
                  ?.toLowerCase()
                  .trim()
                  .includes(searchInput) ||
                item.nodeId.toLowerCase().trim().includes(searchInput)
              );
            }
          );
          this.cdrf.markForCheck();
        })
      )
      .subscribe();
  }

  handleNodeToggle = (event: any) => {
    const { uid, isSelected } = event;
    if (isSelected) this.selectedItems = [...this.selectedItems, event];
    else
      this.selectedItems = this.selectedItems.filter(
        (item) => item.uid !== uid
      );

    if (event.id)
      this.initialSelectedItems = [...this.initialSelectedItems, event];

    this.isMasterChecked = this.selectedItems.length === this.allItems.length;

    this.isMasterCheckedData = {
      checked: this.isMasterChecked,
      masterToggle: false
    };
  };

  handleMasterToggle = (event: MatCheckboxChange) => {
    const { checked } = event;
    this.isMasterCheckedData = {
      checked,
      masterToggle: true
    };
    if (checked) this.selectedItems = this.allItems;
    else this.selectedItems = this.initialSelectedItems as HierarchyEntity[];
  };

  cancel = () => {
    this.dialogRef.close();
  };

  submitSelectedLocations = () => {
    this.handleLocationHierarchy.emit(this.selectedItems);
  };

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
