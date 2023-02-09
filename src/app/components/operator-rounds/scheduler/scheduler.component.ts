import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  tabIndex: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tabIndex }) => {
      this.tabIndex = tabIndex;
    });
  }

  getSelectedIndex(): number {
    return this.tabIndex;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.router.navigate(['/operator-rounds/scheduler', this.tabIndex]);
  }
}
