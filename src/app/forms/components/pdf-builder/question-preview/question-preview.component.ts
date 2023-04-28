/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { fieldTypesMock } from '../../response-type/response-types.mock';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class QuestionPreviewComponent implements OnInit {
  @Input() question: any;
  @Input() pdfConfigOptions: any;

  fieldTypes: any;
  hideMockFieldValueTypes = ['LF', 'HL', 'INST', 'ATT', 'TAF', 'ARD'];
  htmlMocks = ['VI', 'DDM', 'INST', 'HL', 'CB', 'SGF'];
  inlineMockResponses = ['LF', 'INST', 'ATT', 'LTV', 'TAF', 'ARD'];
  fieldTypeMockValues = {
    INST: 'Instructions',
    TF: 'Answer Text Goes Here',
    NF: 55,
    DD: '',
    SF: 'Can be a part number',
    DT: '02/01/23, 6:00 PM',
    HL: `<a href="">www.innovapptive.com</a>`,
    CB: `<span>Checked <input type="checkbox" checked /></span>`,
    SGF: '',
    ATT: '2 Attachments',
    VI: `<span style="color:green; border:0.715174px solid #CCCCCC">Yes</span>`,
    RT: 5,
    IMG: '',
    LTV: 'Notes Added',
    GAL: '14 Lang Rd, Centennial Park NSW 2021, Australia (-33.8912784, 151.2322645)',
    DDM: `<span style="color:green; border:0.715174px solid #CCCCCC">Yes</span>`,
    DFR: '02/01/23 - 02/06/23',
    TAF: 'Tabular View',
    ARD: 'Array Fields',
    USR: 'User'
  };

  dummyImages = [];

  constructor(private imageUtils: ImageUtils) {}

  formatLabel(value: number): string {
    return `${value}`;
  }

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes;
  }
  getMockValueForField(fieldType) {
    return this.fieldTypeMockValues[fieldType];
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }
}
