import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss'],
})
export class CommonFilterComponent implements OnInit {

  public filterIcon = "../../../assets/maintenance-icons/filterIcon.svg";

  @Input() title1;
  @Input() showOverdueList
  constructor() { }

  ngOnInit() {}

}
