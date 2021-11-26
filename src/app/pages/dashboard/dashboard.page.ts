import { Component} from '@angular/core';


@Component({
  selector: 'app-instruction-home',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardComponent{
  headerTitle = "Dashboard";
  noOfDays;

  constructor() { }


  ngOnInit() {
    this.noOfDays = 37;
  }


}

