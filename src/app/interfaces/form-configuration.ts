export interface RaceDynamicForm extends FormMetadata {
  pages: Page[];
  counter: number;
  formStatus: 'Draft' | 'Published';
}

export interface FormMetadata {
  id?: string;
  name: string;
  description: string;
  formLogo: string;
  isPublic: boolean;
  isArchived: boolean;
  formType: 'Standalone' | 'Embedded';
  formStatus: 'Draft' | 'Published';
  integrationType: string;
  tags: string[];
  searchTerm: string;
  hierarchy?: any;
  plantId?: string;
  plant: string;
  pdfTemplateConfiguration: any;
  instructions: any;
  lastModifiedBy: string;
  embeddedFormId?: string;
  additionalDetails: string;
}

export interface Page {
  name: string;
  position: number;
  isOpen: boolean;
  sections: Section[];
  questions: Question[];
  logics: any[];
}

export interface TaskLevelSchedulePage extends Page {
  complete: boolean;
  partiallyChecked: boolean;
  sections: TaskLevelScheduleSection[];
  questions: TaskLevelScheduleQuestion[];
}

export interface TaskLevelScheduleSubForm {
  [key: string]: TaskLevelSchedulePage[];
}

export interface Section {
  id: string;
  name: string;
  position: number;
  isOpen: boolean;
  isImported?: boolean;
  templateId?: string;
  templateName?: string;
  externalSectionId?: string;
  counter?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface TaskLevelScheduleSection extends Section {
  complete: boolean;
  partiallyChecked: boolean;
}

export interface Question {
  id: string;
  sectionId: string;
  name: string;
  fieldType: string;
  position: number;
  required: boolean;
  enableHistory: boolean;
  historyCount: number;
  multi: boolean;
  value: any;
  isPublished: boolean;
  isPublishedTillSave: boolean;
  isOpen: boolean;
  isResponseTypeModalOpen: boolean;
  unitOfMeasurement?: string;
  rangeMetadata?: NumberRangeMetadata;
  additionalDetails?: AdditionalDetails;
  skipIdGeneration?: boolean;
  analysisInfo?: AnalysisInfo;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface TaskLevelScheduleQuestion extends Question {
  complete: boolean;
}

export interface SectionQuestions {
  section: Section;
  questions: Question[];
  logics?: any[];
}

export interface NumberRangeMetadata {
  min: number;
  max: number;
  minAction: string;
  maxAction: string;
  minMsg: string;
  maxMsg: string;
  value: number;
}

export interface AdditionalDetails {
  tags: any[];
  attributes: any[];
}

export interface AnalysisInfo {
  component: string;
  samplingPoint: string;
  refImage: string;
  machineSNO: string;
}

export interface PageEvent {
  pageIndex: number;
  page?: Page;
  type: 'add' | 'update' | 'delete';
}

export interface SectionEvent {
  pageIndex: number;
  sectionIndex: number;
  section?: Section;
  type: 'add' | 'update' | 'delete' | 'copy' | 'unlink';
}

export interface QuestionEvent {
  pageIndex: number;
  sectionId: string;
  question?: Question;
  questionId?: string;
  questionIndex: number;
  type: 'add' | 'update' | 'delete';
  isAskQuestion?: boolean;
}

export interface InstructionsFile {
  name: string;
  size: number;
  objectKey: string;
  objectURL: string;
}
export interface FormUploadFile {
  name: string;
  size: number;
  objectKey: string;
}
