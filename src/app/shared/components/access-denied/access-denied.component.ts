import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {
  url: string;

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderTitle('Access Denied');
    this.route.queryParams.subscribe((parmas) => {
      const { url } = parmas;
      this.url = `${window.location.origin}/#${url}`;
    });
  }
}
