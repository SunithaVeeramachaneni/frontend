import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';
import { Question } from 'src/app/interfaces';
import { DynamicPreviewResponseTypeLoaderDirective } from '../directives/dynamic-preview-response-type-loader.directive';
import { ReadOnlyResponseComponent } from '../response-types/read-only-response/read-only-response.component';
import { InstructionResponseComponent } from '../response-types/instruction-response/instruction-response.component';
import { TextAnswerResponseComponent } from '../response-types/text-answer-response/text-answer-response.component';
import { ScanResponseComponent } from '../response-types/scan-response/scan-response.component';
import { NumberResponseComponent } from '../response-types/number-response/number-response.component';
import { DateTimeResponseComponent } from '../response-types/date-time-response/date-time-response.component';
import { HyperlinkResponseComponent } from '../response-types/hyperlink-response/hyperlink-response.component';
import { CheckboxResponseComponent } from '../response-types/checkbox-response/checkbox-response.component';
import { SignatureResponseComponent } from '../response-types/signature-response/signature-response.component';
import { SliderResponseComponent } from '../response-types/slider-response/slider-response.component';
import { LocationResponseComponent } from '../response-types/location-response/location-response.component';
import { DateRangeResponseComponent } from '../response-types/date-range-response/date-range-response.component';
import { AttachmentResponseComponent } from '../response-types/attachment-response/attachment-response.component';
import { DropdownResponseComponent } from '../response-types/dropdown-response/dropdown-response.component';
import { VisibleInputResponseComponent } from '../response-types/visible-input-response/visible-input-response.component';
import { AnalysisAttachmentResponseComponent } from '../response-types/analysis-attachment-response/analysis-attachment-response.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-preview-question',
  templateUrl: './preview-question.component.html',
  styleUrls: ['./preview-question.component.scss']
})
export class PreviewQuestionComponent implements OnInit {
  @ViewChild(DynamicPreviewResponseTypeLoaderDirective, { static: true })
  dynamicPreviewResponse!: DynamicPreviewResponseTypeLoaderDirective;

  @ViewChild('dynamicResponseView', { read: ViewContainerRef })
  dynamicResponseView!: ViewContainerRef;

  @Input() question: Question;
  @Input() moduleType: string;
  @Output() isOpenBottomSheet = new EventEmitter();

  fieldTypes = new Map();
  fieldTypeRef = [
    ReadOnlyResponseComponent,
    InstructionResponseComponent,
    TextAnswerResponseComponent,
    NumberResponseComponent,
    ScanResponseComponent,
    DateTimeResponseComponent,
    HyperlinkResponseComponent,
    CheckboxResponseComponent,
    SignatureResponseComponent,
    AttachmentResponseComponent,
    SliderResponseComponent,
    LocationResponseComponent,
    DateRangeResponseComponent,
    VisibleInputResponseComponent,
    DropdownResponseComponent,
    AnalysisAttachmentResponseComponent
  ];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.initializeFieldTypeRef();
    this.loadDynamicResponseType();
  }

  openMoreMenu(): void {
    this.isOpenBottomSheet.emit({
      isOpen: true,
      isHistoryVisible: this.question.enableHistory,
      historyCount: this.question.historyCount
    });
  }

  private initializeFieldTypeRef(): void {
    this.fieldTypes.set('LF', 0);
    this.fieldTypes.set('INST', 1);
    this.fieldTypes.set('TF', 2);
    this.fieldTypes.set('NF', 3);
    this.fieldTypes.set('SF', 4);
    this.fieldTypes.set('DT', 5);
    this.fieldTypes.set('HL', 6);
    this.fieldTypes.set('CB', 7);
    this.fieldTypes.set('SGF', 8);
    this.fieldTypes.set('ATT', 9);
    this.fieldTypes.set('RT', 10);
    this.fieldTypes.set('GAL', 11);
    this.fieldTypes.set('DFR', 12);
    this.fieldTypes.set('VI', 13);
    this.fieldTypes.set('DD', 14);
    this.fieldTypes.set('IMA', 15);
  }

  private loadDynamicResponseType() {
    this.dynamicPreviewResponse.viewContainerRef.remove();
    if (
      this.fieldTypes.has(this.question.fieldType) &&
      this.fieldTypes.get(this.question.fieldType) < this.fieldTypeRef.length
    ) {
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          this.fieldTypeRef[this.fieldTypes.get(this.question.fieldType)]
        );
      const componentRef =
        this.dynamicPreviewResponse.viewContainerRef.createComponent(
          componentFactory
        );
      componentRef.instance.question = this.question;
    }
  }
}
