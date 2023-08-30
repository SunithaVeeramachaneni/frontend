import { Component, OnInit, NgZone } from '@angular/core';
import { InstructionService } from '../services/instruction.service';
import { Observable } from 'rxjs';
import { SseService } from 'src/app/shared/services/sse.service';
import { environment } from 'src/environments/environment';
import { data } from '../../user-management/services/users.mock';

@Component({
  selector: 'app-work-instruction-authoring',
  templateUrl: './work-instruction-authoring.component.html',
  styleUrls: ['./work-instruction-authoring.component.scss']
})
export class WorkInstructionAuthoringComponent implements OnInit {
  globalData: any;
  tags: any;
  header: any;
  steps: any;
  image: string;
  stepsInstructionList: any = [];
  currentStep: any;
  generateSteps$: Observable<any>;
  constructor(
    private service: InstructionService,
    private sseService: SseService,
    private zone: NgZone
  ) {}
  ngOnInit(): void {
    this.globalData = { ...this.service.stepsData$.value };
    console.log(this.globalData);
    const { tags, header, steps, image } = this.globalData;
    this.tags = tags;
    this.header = header;
    this.steps = steps;
    this.image = image;

    this.generateSteps$ = this.getFormUploadData$(this.globalData);

    this.generateSteps$.subscribe((data) => {
      this.stepsInstructionList.push(data.stepsObject);
      this.setCurrentStep(data.stepsObject);
    });
  }

  getFormUploadData$ = (
    globalData,
    formData = new FormData()
  ): Observable<any> =>
    new Observable((observer) => {
      const params: URLSearchParams = new URLSearchParams();
      params.append('globalData', JSON.stringify(globalData));
      const eventSourceForms = this.sseService.getEventSourceWithPost(
        environment.wiApiUrl,
        'generateDetails?' + params.toString(),
        formData
      );

      eventSourceForms.stream();
      eventSourceForms.onmessage = (event) => {
        console.log(event);
        const eventData = JSON.parse(event.data);
        const { steps } = eventData;
        const stepsObject = JSON.parse(steps);
        this.zone.run(() => {
          observer.next({
            stepsObject
          });
        });
      };

      eventSourceForms.onerror = (event) => {
        console.log(event);
        this.zone.run(() => {
          observer.error(JSON.parse(event.error));
        });
      };
    });

  setCurrentStep = (step) => {
    const index = this.stepsInstructionList.findIndex((s) => s === step);
    this.currentStep = {
      ...step,
      index: index + 1
    };
  };
}
