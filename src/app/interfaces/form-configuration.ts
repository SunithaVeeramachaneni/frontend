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
  tags: string[];
  searchTerm: string;
  hierarchy?: any;
  plantId?: string;
  plant: string;
  pdfTemplateConfiguration: any;
  instructions: any;
  lastModifiedBy: string;
}

export interface Page {
  name: string;
  position: number;
  isOpen: boolean;
  sections: Section[];
  questions: Question[];
  logics: any[];
}

export interface Section {
  id: string;
  name: string;
  position: number;
  isOpen: boolean;
}

export interface Question {
  id: string;
  sectionId: string;
  name: string;
  fieldType: string;
  position: number;
  required: boolean;
  enableHistory: boolean;
  multi: boolean;
  value: any;
  isPublished: boolean;
  isPublishedTillSave: boolean;
  isOpen: boolean;
  isResponseTypeModalOpen: boolean;
  unitOfMeasurement?: string;
  rangeMetadata?: NumberRangeMetadata;
}

export interface SectionQuestions {
  section: Section;
  questions: Question[];
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

export interface PageEvent {
  pageIndex: number;
  page?: Page;
  type: 'add' | 'update' | 'delete';
}

export interface SectionEvent {
  pageIndex: number;
  sectionIndex: number;
  section?: Section;
  type: 'add' | 'update' | 'delete';
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
