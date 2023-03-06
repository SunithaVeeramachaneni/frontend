import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-hierarchy-locations-list',
  templateUrl: './hierarchy-locations-list.component.html',
  styleUrls: ['./hierarchy-locations-list.component.scss']
})
export class HierarchyLocationsListComponent implements OnInit {
  @Output() handleLocationHierarchy: EventEmitter<any> =
    new EventEmitter<any>();
  @Input() set locationsData(data: any) {
    this.allLocations$ = data ? data : ({} as Observable<any>);
  }
  allLocations$: Observable<any>;
  public isMasterChecked: boolean;
  public isMasterCheckedData: any = {
    checked: false,
    masterToggle: false
  };
  public selectedItems = [];
  private allItems = [];
  constructor() {}

  ngOnInit(): void {
    this.isMasterChecked = false;
    this.allLocations$
      .pipe(
        tap((allLocations) => {
          allLocations.items.forEach((location) =>
            this.allItems.push(location.id)
          );
        })
      )
      .subscribe();
  }

  handleDataCount = (event: any) => {
    const { masterDataId } = event;
    if (this.selectedItems.find((item) => item === masterDataId)) {
      this.selectedItems = this.selectedItems.filter(
        (item) => item !== masterDataId
      );
    } else this.selectedItems = [...this.selectedItems, masterDataId];

    this.isMasterChecked = this.selectedItems.length === this.allItems.length;

    this.isMasterCheckedData = {
      checked: this.isMasterChecked,
      masterToggle: false
    };
  };

  handleMasterToggle = (event: MatCheckboxChange) => {
    const { checked } = event;
    if (checked) {
      this.selectedItems = this.allItems;
    } else this.selectedItems = [];

    this.isMasterCheckedData = {
      checked: this.isMasterChecked,
      masterToggle: true
    };
  };

  submitSelectedLocations = () => {
    this.handleLocationHierarchy.emit({
      ids: this.selectedItems
    });
  };
}
