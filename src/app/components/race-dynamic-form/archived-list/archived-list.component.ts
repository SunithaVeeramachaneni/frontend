import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-archived-list',
  templateUrl: './archived-list.component.html',
  styleUrls: ['./archived-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedListComponent implements OnInit {
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
    this.router.navigate(['/forms/archived', this.tabIndex]);
  }
}
