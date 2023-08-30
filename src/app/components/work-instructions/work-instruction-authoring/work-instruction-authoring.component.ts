import { Component, OnInit, NgZone } from '@angular/core';
import { InstructionService } from '../services/instruction.service';
import { BehaviorSubject, Observable } from 'rxjs';
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
  status = 'Draft Saved';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private service: InstructionService,
    private sseService: SseService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.isLoading$.next(true);
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
      this.isLoading$.next(false);
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
        const eventData = JSON.parse(event.data);
        const { steps, IMAGE } = eventData;
        const stepsObject = JSON.parse(steps);
        this.zone.run(() => {
          observer.next({
            stepsObject: { ...stepsObject, IMAGE }
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
    const { IMAGE, ...rest } = step;
    this.currentStep = {
      ...rest,
      index: index + 1
    };
    setTimeout(() => {
      this.currentStep = {
        ...this.currentStep,
        IMAGE
      };
    }, 1000);
    console.log(this.currentStep);
  };
}
