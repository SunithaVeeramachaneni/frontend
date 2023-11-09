import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { UserDetails, UserInfo } from 'src/app/interfaces';
import { map, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast';
import { fileUploadSizeToastMessage, routingUrls } from 'src/app/app.constants';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs';
import { ShrSummaryService } from '../services/shr-summary.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../../login/services/login.service';

type ShiftDetails = {
  plant: {
    plantId: string;
    plantName: string;
  };
  unit: {
    unitId: string;
    unitName: string;
  };
  currentShift: string;
  shiftSupervisor: string;
  upcomingShift: string;
  upcomingShiftSupervisor: string;
  shiftId: string;
};

@Component({
  selector: 'app-shr-summary',
  templateUrl: './shr-summary.component.html',
  styleUrls: ['./shr-summary.component.scss']
})
export class ShrSummaryComponent implements OnInit, OnChanges {
  @Input() shrAllDetails;
  @Input() selectedRow;
  moduleName = 'round-observations';
  roundPlanFileUpload: ElementRef;
  base64result: string;
  filteredMediaType: any = { mediaType: [] };
  filteredMediaTypeIds: any = { mediaIds: [] };
  summaryForm: FormGroup;
  pdfFiles: any = { mediaType: [] };
  filteredMediaPdfTypeIds: any = [];
  filteredMediaPdfType: any = [];
  userInfo;
  isHandOverStarted = false;
  shiftDetails: ShiftDetails;
  summaryDetails: any;
  shiftRows = [
    [
      { label: 'Plant', formName: 'plant' },
      { label: 'Unit', formName: 'unit' }
    ],
    [
      { label: 'Current Shift', formName: 'currentShift' },
      { label: 'Shift Supervisor', formName: 'shiftSupervisor' }
    ],
    [
      { label: 'Upcoming Shift', formName: 'upcomingShift' },
      {
        label: 'Upcoming Shift Supervisor',
        formName: 'upcomingShiftSupervisor'
      }
    ]
  ];
  users$: Observable<UserDetails[]>;
  currentRouteUrl$: Observable<string>;
  userInfo$: Observable<UserInfo>;

  isTrendsVisible = true;
  isInstructionsVisible = true;
  isShiftInfoVisible = true;
  roundsCompliance = 0;
  tasksCompliance = 0;
  issuesHighPriority = 0;
  actionsHighPriority = 0;
  pendingIssues = 0;
  pendingActions = 0;

  readonly routingUrls = routingUrls;

  options = {
    avoidLabelOverlap: true,
    label: {
      show: true,
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      formatter(param: any) {
        return param?.value;
      }
    },
    grid: {
      containLabel: true
    },
    title: {
      text: '',
      subtext: '',
      left: '22%',
      top: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: 'center',
      right: 0
    },
    series: [
      {
        name: '',
        type: 'pie',
        top: 'center',
        left: '-50%',
        right: '0%',
        bottom: '0%',
        radius: [25, 45],
        color: [],
        data: [],
        labelLine: {
          show: true
        }
      }
    ]
  };

  barOptions = {
    avoidLabelOverlap: true,
    label: {
      show: true,
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      formatter(param: any) {
        return param?.value;
      }
    },
    grid: {
      containLabel: true,
      bottom: '0%',
      right: '10%'
    },
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },
    xAxis: {
      show: false,
      type: 'value',
      name: '',
      nameLocation: 'middle',
      nameTextStyle: {
        lineHeight: 30
      },
      axisLine: {
        show: false
      },
      axisTick: {
        alignWithLabel: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        interval: 0,
        overflow: 'truncate',
        ellipsis: '...',
        width: 30
      }
    },
    yAxis: {
      type: 'category',
      name: '',
      axisLine: {
        show: true
      },
      axisTick: {
        alignWithLabel: true
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        interval: 0,
        overflow: 'truncate',
        ellipsis: '...',
        width: 100
      },
      data: []
    },
    series: [
      {
        name: '',
        type: 'bar',
        color: [],
        data: [],
        labelLine: {
          show: false
        },
        label: {
          normal: {
            show: true,
            position: 'right'
          }
        }
      }
    ]
  };
  summaryData = {
    rounds: {},
    tasks: {},
    issues: {},
    actions: {}
  };

  chartData = {
    rounds: [],
    issues: [],
    actions: [],
    exceptions: [],
    notesLogs: []
  };

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private cdrf: ChangeDetectorRef,
    private toastService: ToastService,
    private imageCompress: NgxImageCompressService,
    private summaryService: ShrSummaryService,
    private loginService: LoginService,
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.summaryForm) {
      this.setInitialValues();
    }
  }

  ngOnInit(): void {
    this.userInfo = this.loginService.getLoggedInUserInfo();
    this.prepareShiftDetails();
    this.prepareShrDetails();
    this.prepareSummaryChart();

    this.summaryForm = this.fb.group({
      supervisorNotes: [''],
      standingInstructions: [''],
      plant: [''],
      unit: [''],
      currentShift: [''],
      shiftSupervisor: [''],
      upcomingShift: [''],
      upcomingShiftSupervisor: ['']
    });
    this.setInitialValues();

    this.operatorRoundsService.attachmentsMapping$
      .pipe(map((data) => (Array.isArray(data) ? data : [])))
      .subscribe((attachments) => {
        attachments?.forEach((att) => {
          this.filteredMediaType.mediaType = [
            ...this.filteredMediaType.mediaType,
            att.attachment
          ];
          this.filteredMediaTypeIds.mediaIds = [
            ...this.filteredMediaTypeIds.mediaIds,
            att.id
          ];
        });
        this.cdrf.detectChanges();
      });

    this.operatorRoundsService.pdfMapping$
      .pipe(map((data) => (Array.isArray(data) ? data : [])))
      .subscribe((pdfs) => {
        pdfs?.forEach((pdf) => {
          this.pdfFiles = {
            mediaType: [...this.pdfFiles.mediaType, JSON.parse(pdf.fileInfo)]
          };
          this.filteredMediaPdfTypeIds.push(pdf.id);
        });
        this.cdrf.detectChanges();
      });
  }

  prepareShrDetails() {
    if (this.shrAllDetails) {
      const { shrDetails } = this.shrAllDetails;
      this.summaryDetails = {
        summary: shrDetails?.summary ? JSON.parse(shrDetails.summary) : {},
        rounds: shrDetails?.rounds || [],
        actions: shrDetails?.actions || [],
        issues: shrDetails?.actions || []
      };
    }
  }

  handleStartHandOver() {
    this.isHandOverStarted = true;
  }

  prepareShiftDetails() {
    if (this.selectedRow) {
      const {
        shiftSupervisorEmail,
        shift,
        plant,
        unit,
        incomingSupervisor,
        shiftSupervisor,
        shiftStartDatetime,
        shiftEndDatetime,
        shiftId
      } = this.selectedRow;

      if (this.userInfo.email === shiftSupervisorEmail)
        this.handleStartHandOver();

      this.shiftDetails = {
        plant: {
          plantId: plant.id,
          plantName: plant.name || ''
        },
        unit: {
          unitId: unit.id || '',
          unitName: unit.name || ''
        },
        currentShift: `${this.getFormattedDate(shiftStartDatetime)} / ${
          shift.name
        }`,
        shiftSupervisor: shiftSupervisor || '',
        upcomingShift: `${this.getFormattedDate(shiftEndDatetime)} / ${
          shift.name
        }`,
        upcomingShiftSupervisor: incomingSupervisor || '',
        shiftId
      };
    }
  }

  getFormattedDate = (date: string) => {
    const myDate = new Date(
      date?.replace(/-/g, '/').replace(/T.+/, '')
    ).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return myDate;
  };

  setInitialValues() {
    [
      'plant',
      'unit',
      'currentShift',
      'shiftSupervisor',
      'upcomingShift',
      'upcomingShiftSupervisor',
      'supervisorNotes',
      'standingInstructions'
    ].forEach((fname) => {
      if (
        (fname === 'supervisorNotes' || fname === 'standingInstructions') &&
        this.isHandOverStarted
      ) {
        this.summaryForm.get(fname)?.enable();
        return;
      } else this.summaryForm.get(fname)?.disable();
      if (this.shiftDetails) {
        this.summaryForm.get(fname)?.setValue(this.getShiftValue(fname));
      }
    });

    this.chartData = {
      rounds: this.summaryDetails?.rounds || [],
      actions: this.summaryDetails?.actions || [],
      issues: this.summaryDetails?.issues || [],
      exceptions: this.summaryDetails?.summary?.exceptions || [],
      notesLogs: this.summaryDetails?.summary?.notes || []
    };
  }

  getShiftValue(field) {
    const { summary } = this.summaryDetails;
    const {
      plant,
      unit,
      shiftSupervisor,
      currentShift,
      upcomingShift,
      upcomingShiftSupervisor
    } = this.shiftDetails;
    if (field === 'plant') return plant.plantName;
    if (field === 'unit') return unit.unitName;
    if (field === 'currentShift') return currentShift;
    if (field === 'shiftSupervisor') return shiftSupervisor;
    if (field === 'upcomingShift') return upcomingShift;
    if (field === 'upcomingShiftSupervisor') return upcomingShiftSupervisor;
    if (field === 'upcomingShift') return upcomingShift;
    if (field === 'supervisorNotes')
      return summary?.instructions?.supervisorNotes || '';
    if (field === 'standingInstructions')
      return summary?.instructions?.standingInstructions || '';

    if (summary?.instructions) {
      const { image, pdfDocs } = summary?.instructions;
      const attachmentPromises =
        image?.map((attachmentId) =>
          this.operatorRoundsService
            .getAttachmentsById$(attachmentId)
            .toPromise()
            .then()
        ) || [];
      const pdfPromises =
        pdfDocs?.map((pdfId) =>
          this.operatorRoundsService
            .getAttachmentsById$(pdfId)
            .toPromise()
            .then()
        ) || [];
      Promise.all(attachmentPromises).then((result) => {
        this.operatorRoundsService.attachmentsMapping$.next(result);
      });
      Promise.all(pdfPromises).then((result) => {
        this.operatorRoundsService.pdfMapping$.next(result);
      });
    }
  }

  prepareSummaryChart() {
    let issueList = {
      resolved: 0,
      raised: 0,
      carriedover: 0
    };
    let actionList = {
      resolved: 0,
      raised: 0,
      carriedover: 0
    };
    let roundList = {
      submitted: 0,
      overdue: 0,
      open: 0,
      skipped: 0,
      inprogress: 0
    };
    let taskList = {
      total: 0,
      complete: 0,
      skipped: 0,
      incomplete: 0
    };

    this.chartData.rounds.forEach((round) => {
      const uptKey = round.status.toLowerCase();
      const keyExist = Object.keys(roundList).find((k) => k === round.status);
      if (keyExist) {
        roundList = {
          ...roundList,
          [uptKey]: Number(roundList[uptKey] || 0) + 1
        };
      } else {
        roundList = {
          ...roundList,
          [uptKey]: 1
        };
      }

      const total = taskList.total + round.taskCount;
      const complete = taskList.complete + round.taskCompleted;
      const skipped = taskList.skipped + round.taskSkipped;
      taskList = {
        total,
        complete,
        incomplete: total - (complete + skipped),
        skipped
      };
    });

    this.chartData.issues.forEach((issue) => {
      const uptKey = issue.STATUS.toLowerCase();
      const keyExist = Object.keys(issueList)
        .find((k) => k === uptKey)
        ?.toLowerCase();
      if (keyExist) {
        issueList = {
          ...issueList,
          [uptKey]: Number(issueList[uptKey] || 0) + 1
        };
      } else {
        issueList = {
          ...issueList,
          [uptKey]: 1
        };
      }
      if (['open', 'inprogress'].includes(uptKey)) this.pendingIssues++;
      if (issue.PRIORITY === 'High') this.issuesHighPriority++;
    });

    this.chartData.actions.forEach((action) => {
      const uptKey = action.STATUS.toLowerCase();
      const keyExist = Object.keys(actionList)
        .find((k) => k === uptKey)
        ?.toLowerCase();
      if (keyExist) {
        actionList = {
          ...actionList,
          [uptKey]: Number(actionList[uptKey] || 0) + 1
        };
      } else {
        actionList = {
          ...actionList,
          [uptKey]: 1
        };
      }
      if (['open', 'inprogress'].includes(uptKey)) this.pendingActions++;
      if (action.PRIORITY === 'High') this.actionsHighPriority++;
    });

    const totalTasks = taskList.total;
    const totalRounds = this.chartData.rounds?.length;
    this.roundsCompliance = totalRounds ? roundList.submitted / totalRounds : 0;
    this.tasksCompliance = totalTasks ? taskList.complete / totalTasks : 0;

    delete taskList.total;

    this.summaryData = {
      ...this.summaryData,
      rounds: {
        ...this.options,
        title: {
          ...this.options.title,
          text: totalRounds || 0,
          left: totalRounds < 10 ? '22%' : '20%'
        },
        series: [
          {
            ...this.options.series[0],
            ...this.summaryService.prepareColorsAndData(roundList, 'rounds')
          }
        ]
      },
      tasks: {
        ...this.options,
        title: {
          ...this.options.title,
          text: totalTasks || 0,
          right: totalTasks < 10 ? '22%' : '20%'
        },
        series: [
          {
            ...this.options.series[0],
            ...this.summaryService.prepareColorsAndData(taskList, 'tasks')
          }
        ]
      },
      issues: {
        ...this.barOptions,
        yAxis: {
          ...this.barOptions.yAxis,
          data: Object.keys(issueList).map((key) =>
            this.summaryService.formatString(key)
          )
        },
        series: [
          {
            ...this.barOptions.series[0],
            ...this.summaryService.prepareColorsAndData(issueList, 'issues')
          }
        ]
      },
      actions: {
        ...this.barOptions,
        yAxis: {
          ...this.barOptions.yAxis,
          data: Object.keys(actionList).map((key) =>
            this.summaryService.formatString(key)
          )
        },
        series: [
          {
            ...this.barOptions.series[0],
            ...this.summaryService.prepareColorsAndData(actionList, 'actions')
          }
        ]
      }
    };
  }

  toggleRowDisplay(rowType) {
    if (rowType === 'trends') this.isTrendsVisible = !this.isTrendsVisible;
    if (rowType === 'instructions')
      this.isInstructionsVisible = !this.isInstructionsVisible;
    if (rowType === 'shiftInfo')
      this.isShiftInfoVisible = !this.isShiftInfoVisible;
  }

  trackBySelectedattachments(index: number, el: any): string {
    return el?.id;
  }

  roundplanFileUploadHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files);
    const reader = new FileReader();

    if (files.length > 0 && files[0] instanceof File) {
      const file: File = files[0];
      const maxSize = 390000;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.base64result = reader?.result as string;
        if (this.base64result.includes('data:application/pdf;base64,')) {
          this.resizePdf(this.base64result).then((compressedPdf) => {
            const onlybase64 = compressedPdf.split(',')[1];
            const resizedPdfSize = atob(onlybase64).length;
            const pdf = {
              fileInfo: { name: file.name, size: resizedPdfSize },
              attachment: onlybase64
            };
            if (resizedPdfSize <= maxSize) {
              this.operatorRoundsService
                .uploadAttachments$({
                  file: pdf,
                  objectId: this.shiftDetails?.shiftId,
                  plantId: this.shiftDetails?.plant?.plantId
                })
                .pipe(
                  tap((response) => {
                    if (response) {
                      this.pdfFiles = {
                        mediaType: [...this.pdfFiles.mediaType, file]
                      };
                      const responsenew =
                        response?.data?.createRoundPlanAttachments?.id;
                      this.filteredMediaPdfTypeIds.push(responsenew);
                      this.filteredMediaPdfType.push(this.base64result);
                    }
                    this.cdrf.detectChanges();
                  })
                )
                .subscribe();
            } else {
              this.toastService.show({
                type: 'warning',
                text: fileUploadSizeToastMessage
              });
            }
          });
        } else {
          this.resizeImage(this.base64result).then((compressedImage) => {
            const onlybase64 = compressedImage.split(',')[1];
            const resizedImageSize = atob(onlybase64).length;
            const image = {
              fileInfo: { name: file.name, size: resizedImageSize },
              attachment: onlybase64
            };
            if (resizedImageSize <= maxSize) {
              this.operatorRoundsService
                .uploadAttachments$({
                  file: image,
                  objectId: this.shiftDetails?.shiftId,
                  plantId: this.shiftDetails?.plant?.plantId
                })
                .pipe(
                  tap((response) => {
                    if (response) {
                      const responsenew =
                        response?.data?.createRoundPlanAttachments?.id;
                      this.filteredMediaTypeIds = {
                        mediaIds: [
                          ...this.filteredMediaTypeIds.mediaIds,
                          responsenew
                        ]
                      };
                      this.filteredMediaType = {
                        mediaType: [
                          ...this.filteredMediaType.mediaType,
                          onlybase64
                        ]
                      };
                      this.cdrf.detectChanges();
                    }
                  })
                )
                .subscribe();
            } else {
              this.toastService.show({
                type: 'warning',
                text: fileUploadSizeToastMessage
              });
            }
          });
        }
      };
    }
    this.clearAttachmentUpload();
  };

  clearAttachmentUpload() {
    this.roundPlanFileUpload.nativeElement.value = '';
  }

  async resizeImage(base64result: string): Promise<string> {
    const compressedImage = await this.imageCompress.compressFile(
      base64result,
      -1,
      100,
      800,
      600
    );
    return compressedImage;
  }

  async resizePdf(base64Pdf: string): Promise<string> {
    try {
      const base64Data = base64Pdf.split(',')[1];
      const binaryString = atob(base64Data);

      const encoder = new TextEncoder();
      const pdfBytes = encoder.encode(binaryString);

      const pdfDoc = await PDFDocument.load(pdfBytes);

      const currentSize = pdfBytes.length / 1024;
      const desiredSize = 400 * 1024;
      if (currentSize <= desiredSize) {
        return base64Pdf;
      }

      const scalingFactor = Math.sqrt(desiredSize / currentSize);
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.setSize(width * scalingFactor, height * scalingFactor);
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const decoder = new TextDecoder();
      const base64ModifiedPdf = btoa(decoder.decode(modifiedPdfBytes));

      return base64ModifiedPdf;
    } catch (error) {
      throw error;
    }
  }

  roundPlanPdfDeleteHandler(index: number): void {
    this.pdfFiles.mediaType = this.pdfFiles.mediaType.filter(
      (_, i) => i !== index
    );
    this.filteredMediaPdfTypeIds = this.filteredMediaPdfTypeIds.filter(
      (_, i) => i !== index
    );
  }

  roundPlanFileDeleteHandler(index: number): void {
    this.filteredMediaType.mediaType = this.filteredMediaType.mediaType.filter(
      (_, i) => i !== index
    );
    this.filteredMediaTypeIds.mediaIds =
      this.filteredMediaTypeIds.mediaIds.filter((_, i) => i !== index);
  }
}
