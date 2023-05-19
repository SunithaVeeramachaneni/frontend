import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-user-settings-container',
  templateUrl: './user-settings-container.component.html',
  styleUrls: ['./user-settings-container.component.css']
})
export class UserSettingsContainerComponent implements OnInit {
  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderTitle('Profile');
  }
}
