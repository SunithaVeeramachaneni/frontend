import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-user-settings-container',
  templateUrl: './user-settings-container.component.html',
  styleUrls: ['./user-settings-container.component.css']
})
export class UserSettingsContainerComponent implements OnInit {
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.setHeaderTitle('Your Settings');
  }
}
