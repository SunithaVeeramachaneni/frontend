import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent implements OnInit {
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  searchLocation: FormControl;

  constructor() {}

  ngOnInit(): void {}
}
