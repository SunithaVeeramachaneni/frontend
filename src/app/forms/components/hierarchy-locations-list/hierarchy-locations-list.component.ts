import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-hierarchy-locations-list',
  templateUrl: './hierarchy-locations-list.component.html',
  styleUrls: ['./hierarchy-locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyLocationsListComponent implements OnInit {
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
        map((searchInput: string) => {
          this.searchFilterItems = this.allItems.filter(
            (item: HierarchyEntity) =>
              item.name
                .toLocaleLowerCase()
                .includes(searchInput.trim().toLocaleLowerCase())
          );
        })
      )
      .subscribe();

    setTimeout(() => {
      const div = document.getElementById('hidden-click');
      div.click();
    }, 1000);
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

  checkClick = () => {
    this.cdrf.markForCheck();
  };
}
