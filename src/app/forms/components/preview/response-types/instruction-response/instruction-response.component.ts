import { C } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import {
  State,
  getModuleName
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-instruction-response',
  templateUrl: './instruction-response.component.html',
  styleUrls: ['./instruction-response.component.scss']
})
export class InstructionResponseComponent implements OnInit {
  @Input() set question(question: Question) {
    this._question = question;
    const { images, pdf } = question.value;
    this.value.patchValue({ images, pdf });
  }
  get question() {
    return this._question;
  }
  value: FormGroup = this.fb.group({
    images: [[null, null, null]],
    pdf: null
  });
  moduleName: string;
  instructionsMedia: any = {};
  private _question: Question;
  onDestroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private rdfService: RaceDynamicFormService,
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.instructionsMedia = {
      images: [null, null, null],
      pdf: null
    };
    this.store.select(getModuleName).subscribe((moduleName) => {
      this.moduleName = moduleName;
    });

    this.value.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        distinctUntilChanged(),
        pairwise(),
        takeUntil(this.onDestroy$),
        tap(([previous, current]: any) => {
          const { isOpen, isResponseTypeModalOpen, ...prev } = previous;
          const {
            isOpen: currIsOpen,
            isResponseTypeModalOpen: currIsResponseTypeModalOpen,
            ...curr
          } = current;
          console.log(prev, curr);

          if (!isEqual(prev, curr)) {
            this.question.value = current;

            const { value: prevValue } = prev;
            const { value: currValue } = curr;

            if (
              current.fieldType === 'INST' &&
              !isEqual(prevValue, currValue)
            ) {
              const { images, pdf } = currValue;
              this.instructionsMedia = {
                images: [null, null, null],
                pdf: null
              };
              this.getMedia(images, pdf);
            }
          }
        })
      )
      .subscribe();
  }

  getNoneTag() {
    return this.translate.instant('noneTag');
  }

  getMedia(images, pdf) {
    const imagesPromises = images.map((imageId) =>
      this.moduleName === 'RDF'
        ? this.rdfService.getAttachmentsById$(imageId).toPromise().then()
        : this.operatorRoundsService
            .getAttachmentsById$(imageId)
            .toPromise()
            .then()
    );
    const pdfPromises =
      this.moduleName === 'RDF'
        ? this.rdfService.getAttachmentsById$(pdf).toPromise()
        : this.operatorRoundsService.getAttachmentsById$(pdf).toPromise();

    let imageArray = [];
    Promise.all(imagesPromises).then((images) => {
      imageArray = images.map((img: any) => {
        if (img?.attachment) {
          return `data:image/jpeg;base64,${img?.attachment}`;
        } else {
          return null;
        }
      });
      this.instructionsMedia.images = imageArray;
      console.log(this.instructionsMedia.images);
    });
    pdfPromises.then((pdf) => {
      console.log(JSON.parse(pdf?.fileInfo));
      this.instructionsMedia.pdf = pdf ? JSON.parse(pdf.fileInfo) : null;
    });

    console.log(this.instructionsMedia);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
