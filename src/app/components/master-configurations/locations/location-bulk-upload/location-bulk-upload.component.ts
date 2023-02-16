import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-bulk-upload',
  templateUrl: './location-bulk-upload.component.html',
  styleUrls: ['./location-bulk-upload.component.scss']
})
export class LocationBulkUploadComponent implements OnInit {
  loadResults = false;
  constructor() {}

  ngOnInit(): void {}

  getBorderStyle = (hide: boolean = false) => {
    let border;
    if (hide) {
      border = 0;
    } else {
     border = '1px solid #c8ced3';
    }
    return { 'border-top': border };
  };
}
