import { Component, DebugElement, OnInit } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppMaterialModules } from '../../../material.module';

import { CustomPaginationControlsComponent } from './custom-pagination-controls.component';

describe('CustomPaginationControlsComponent', () => {
  let component: CustomPaginationControlsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let paginationDe: DebugElement;
  let paginationEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPaginationControlsComponent, TestWrapperComponent],
      imports: [NgxPaginationModule, AppMaterialModules],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    paginationDe = fixture.debugElement;
    paginationEl = paginationDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should render pagination controls and page numbers', () => {
      const paginationControls = paginationEl.querySelectorAll('.p-0');
      const links = paginationEl.querySelectorAll('a');
      const divs = paginationEl.querySelectorAll('.custom-pagination div');
      expect(paginationControls.length).toBe(4);
      expect(links.length).toBe(11);
      expect(paginationEl.querySelectorAll('mat-icon').length).toBe(4);
      expect(paginationControls[0] as HTMLElement).toHaveClass('disabled');
      expect(paginationControls[1] as HTMLElement).toHaveClass('disabled');
      expect(paginationControls[2] as HTMLElement).not.toHaveClass('disabled');
      expect(paginationControls[3] as HTMLElement).not.toHaveClass('disabled');
      expect(divs[2] as HTMLElement).toHaveClass('current');
      expect((links[2] as HTMLElement).textContent).toContain('1');
    });

    it('should select 3rd page', () => {
      const paginationControls = paginationEl.querySelectorAll('.p-0');
      const links = paginationEl.querySelectorAll('a');
      expect(paginationControls.length).toBe(4);
      expect(links.length).toBe(11);
      expect(paginationEl.querySelectorAll('mat-icon').length).toBe(4);
      (links[4] as HTMLElement).click();
      fixture.detectChanges();
      expect(paginationControls[0] as HTMLElement).not.toHaveClass('disabled');
      expect(paginationControls[1] as HTMLElement).not.toHaveClass('disabled');
      expect(paginationControls[2] as HTMLElement).not.toHaveClass('disabled');
      expect(paginationControls[3] as HTMLElement).not.toHaveClass('disabled');
      const divs = paginationEl.querySelectorAll('.custom-pagination div');
      expect(divs[4] as HTMLElement).toHaveClass('current');
      expect((links[4] as HTMLElement).textContent).toContain('3');
    });

    it('should select last page', () => {
      const paginationControls = paginationEl.querySelectorAll('.p-0');
      const links = paginationEl.querySelectorAll('a');
      expect(paginationControls.length).toBe(4);
      expect(links.length).toBe(11);
      expect(paginationEl.querySelectorAll('mat-icon').length).toBe(4);
      (paginationControls[3] as HTMLElement).click();
      fixture.detectChanges();
      expect(paginationControls[0] as HTMLElement).not.toHaveClass('disabled');
      expect(paginationControls[1] as HTMLElement).not.toHaveClass('disabled');
      expect(paginationControls[2] as HTMLElement).toHaveClass('disabled');
      expect(paginationControls[3] as HTMLElement).toHaveClass('disabled');
      const divs = paginationEl.querySelectorAll('.custom-pagination div');
      expect(divs[8] as HTMLElement).toHaveClass('current');
      expect((links[8] as HTMLElement).textContent).toContain('10');
    });
  });
});

@Component({
  selector: 'app-test-wrapper',
  template: `<ul>
      <li *ngFor="let item of collection | paginate: config" class="list-item">
        {{ item }}
      </li>
    </ul>
    <pagination-template
      #p="paginationApi"
      [id]="config.id"
      (pageChange)="config.currentPage = $event"
      (pageBoundsCorrection)="config.currentPage = $event"
    >
      <app-custom-pagination-controls
        [paginationData]="p"
      ></app-custom-pagination-controls>
    </pagination-template>`,
})
class TestWrapperComponent implements OnInit {
  config: any = {
    id: 'paginationTest',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false,
  };
  collection = [];
  ngOnInit(): void {
    for (let i = 0; i < 60; i++) {
      this.collection = [...this.collection, i];
    }
  }
}
