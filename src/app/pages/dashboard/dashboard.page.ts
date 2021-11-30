import { Component} from '@angular/core';


@Component({
  selector: 'app-instruction-home',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardComponent{
  headerTitle = "Dominion Energy";
  noOfDays;
  buttonSegment = 'usageReport';

  constructor() { }


  ngOnInit() {
    this.noOfDays = 37;
  }


}

