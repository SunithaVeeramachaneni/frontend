export interface RaceDynamicForm extends FormMetadata {
  id?: string;
  pages: Page[];
  counter: number;
  formStatus: 'draft' | 'published';
}

export interface FormMetadata {
  name: string;
  description: string;
  formLogo: string;
  isPublic: boolean;
  isArchived: boolean;
  formType: 'standalone' | 'embedded';
  formStatus: 'draft' | 'published';
  tags: string[];
}

export interface Page {
  name: string;
  position: number;
  sections: Section[];
  questions: Question[];
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

export interface AddPageEvent {
  pageIndex: number;
}

export interface AddPageEvent {
  pageIndex: number;
}

export interface AddSectionEvent {
  pageIndex: number;
  sectionIndex: number;
}

export interface UpdateSectionEvent {
  pageIndex: number;
  section: Section;
}

export interface AddQuestionEvent {
  pageIndex: number;
  sectionId: string;
  questionIndex: number;
}

export interface UpdateQuestionEvent {
  pageIndex: number;
  sectionId: string;
  question: Question;
}
