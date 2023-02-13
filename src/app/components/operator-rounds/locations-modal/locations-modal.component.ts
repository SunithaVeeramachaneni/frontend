import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssetsModalComponent } from '../assets-modal/assets-modal.component';
import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-locations-modal',
  templateUrl: './locations-modal.component.html',
  styleUrls: ['./locations-modal.component.scss']
})
export class LocationsModalComponent implements OnInit {
  allLocations$: Observable<any>;
  public isMasterChecked: boolean;
  public isMasterCheckedData: any;
  public selectedItems = [];
  private allItems = [];
  constructor(
    private dialog: MatDialog,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.isMasterChecked = false;
    this.allLocations$ = this.locationService.fetchAllLocations$();
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

  assets = () => {
    const dialogRef = this.dialog.open(AssetsModalComponent, {});
  };

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
}
