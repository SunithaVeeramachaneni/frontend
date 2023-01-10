import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submission-view',
  templateUrl: './submission-view.component.html',
  styleUrls: ['./submission-view.component.scss']
})
export class SubmissionViewComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToBack() {
    this.router.navigate(['/forms/submissions']);
  }
}
