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
  counter?: number;
}

export interface Page {
  name: string;
  position: number;
  sections: Section[];
  questions: Question[];
  logics: any[];
}

export interface Section {
  id: string;
  name: string;
  position: number;
}

export interface Question {
  id: string;
  sectionId: string;
  name: string;
  fieldType: string;
  position: number;
  required: boolean;
  multi: boolean;
  value: any;
  isPublished: boolean;
  isPublishedTillSave: boolean;
}

export interface PageEvent {
  pageIndex: number;
  type: 'add' | 'delete';
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
  questionIndex: number;
  type: 'add' | 'update' | 'delete';
}
