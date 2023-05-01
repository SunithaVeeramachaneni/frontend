import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';

@Component({
  selector: 'app-master-data-slider',
  templateUrl: './master-data-slider.component.html',
  styleUrls: ['./master-data-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterDataSliderComponent implements OnInit {
  @Input() selectedLabel: string;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() selectedMasterData: EventEmitter<any> = new EventEmitter();

  labels = [];
  fields = {};
  dependentFields = {};
  selectedPrimaryField: string;
  selectedSecondaryField: string;
  selectedDependentFields: string[];

  constructor(private responseSetService: ResponseSetService) {}

  ngOnInit(): void {
    this.responseSetService.listMasterDataResponses().subscribe((data) => {
      this.labels = Object.keys(data);
      this.fields = Object.fromEntries(
        Object.entries(data).map(([k, v]: [any, any]) => [k, v.fields])
      );
      this.dependentFields = Object.fromEntries(
        Object.entries(data).map(([k, v]: [any, any]) => [k, v.dependentFields])
      );
    });
  }

  cancel(): void {
    this.slideInOut.emit('out');
  }

  save(): void {
    this.selectedMasterData.emit({
      label: this.selectedLabel,
      primaryField: this.selectedPrimaryField,
      secondaryField: this.selectedSecondaryField,
      dependentFields: this.selectedDependentFields?.toString()
    });
    this.slideInOut.emit('out');
  }
}
