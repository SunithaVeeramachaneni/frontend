import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantsComponent implements OnInit {
  selectedProduct = 'allproducts';
  constructor() {}

  ngOnInit(): void {}
}
