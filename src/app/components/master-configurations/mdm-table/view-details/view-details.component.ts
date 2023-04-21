import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { slideInOut } from 'src/app/animations';
@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ViewDetailsComponent implements OnInit {
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  // openAssetsDetailedView = 'out';
  assetsAddOrEditOpenState = 'out';
  assetsEditData;
  constructor() {}
  ngOnInit(): void {}
  onCloseAssetsAddOrEditOpenState(event) {
    this.assetsAddOrEditOpenState = event;
  }
  // onCloseAssetsDetailedView(event) {
  //   this.openAssetsDetailedView = event.status;
  //   if (event.data !== '') {
  //     this.assetsEditData = event.data;
  //     this.assetsAddOrEditOpenState = 'in';
  //   }
  // }
  // rowLevelActionHandler = ({ data, action }): void => {
  //   switch (action) {
  //     case 'edit':
  //       this.assetsEditData = { ...data };
  //       this.assetsAddOrEditOpenState = 'in';
  //       break;
  //     case 'delete':
  //       this.deleteAsset(data);
  //       break;
  //     default:
  //   }
  // };
  // deleteAsset(asset: any): void {
  //   const deleteData = {
  //     id: asset.id,
  //     _version: asset._version
  //   };
  // }
  addManually() {
    console.log(this.assetsAddOrEditOpenState);
    this.assetsAddOrEditOpenState = 'in';
    this.assetsEditData = null;
    console.log(this.assetsAddOrEditOpenState);
  }
}
