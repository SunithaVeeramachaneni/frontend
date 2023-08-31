import { Component, OnInit, NgZone } from '@angular/core';
import { UploadImagePreviewComponent } from 'src/app/forms/components/upload-image-preview/upload-image-preview.component';
import { FormControl } from '@angular/forms';
import { InstructionService } from '../services/instruction.service';
import { ViewChildren, ElementRef, QueryList } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SseService } from 'src/app/shared/services/sse.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-work-instruction-header',
  templateUrl: './work-instruction-header.component.html',
  styleUrls: ['./work-instruction-header.component.scss']
})
export class WorkInstructionHeaderComponent implements OnInit {
  @ViewChildren('inputElement') inputElements!: QueryList<ElementRef>;
  imageSrc: string | ArrayBuffer | null = null;
  base64Image: string | null = null;
  steps = [];
  header: any;
  tags: any;
  prompt = new FormControl('');
  isLoading: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  value = '';
  constructor(
    private service: InstructionService,
    private sseService: SseService,
    private readonly zone: NgZone
  ) {}

  ngOnInit(): void {
    this.prompt.valueChanges.subscribe((data) => {
      this.value = data;
    });
  }
  fileUploadHandler(event) {
    const file = event.target.files[0];
    console.log('File :', file);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSrc = e.target?.result;
      this.base64Image = this.imageSrc as string; // Store base64 in the new variable
      this.base64Image = this.base64Image.split(',')[1];
    };
    reader.readAsDataURL(file);
    console.log(this.base64Image);
  }
  generateSteps() {
    this.steps = [];
    this.isLoading.next(true);
    this.service
      .generateTags$({ image: this.base64Image })
      .subscribe((data) => {
        this.tags = data;
        this.service
          .generateHeaders$({
            tags: JSON.stringify(this.tags),
            prompt: this.prompt.value
          })
          .subscribe((headers) => {
            this.header = headers?.response?.HEADINGS[0];
            console.log(this.header);
            this.service
              .generateSteps$({
                tags: JSON.stringify(this?.tags),
                header: this.header,
                prompt: this.prompt.value
              })
              .subscribe((steps) => {
                let i = 0;
                const intervalId = setInterval(() => {
                  if (i < steps?.steps?.steps.length) {
                    this.steps.push(steps?.steps?.steps[i]);
                    i++;
                  } else {
                    clearInterval(intervalId);
                    this.isLoading.next(false);
                  }
                }, 1000);
                this.service.stepsData$.next({
                  tags: this.tags,
                  header: this.header,
                  prompt: this.prompt.value,
                  steps: this.steps
                });
              });
          });
      });
  }

  addStep() {
    this.steps.push('');
    this.onInputFocus();
  }
  onInputFocus() {
    const inputElementsArray = this.inputElements.toArray();
    inputElementsArray[this?.steps.length - 1].nativeElement.focus();
  }
  deleteStep(index) {
    this.steps.splice(index, 1);
  }

  getFormUploadData$ = (formData): Observable<any> =>
    new Observable((observer) => {
      const params: URLSearchParams = new URLSearchParams();
      const eventSourceForms = this.sseService.getEventSourceWithPost(
        environment.wiApiUrl,
        'generateDetails',
        formData
      );

      eventSourceForms.stream();
      eventSourceForms.onmessage = (event) => {
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
        this.zone.run(() => {
          observer.error(JSON.parse(event.error));
        });
      };
    });
}
