export type GetFormList = {
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  publishedDate?: string | null;
  location?: string | null;
  roundType?: string | null;
  formStatus?: string | null;
  assignee?: string | null;
  tags?: Array<string | null> | null;
  lastPublishedBy?: string | null;
  author?: string | null;
  formType?: string | null;
  isArchived?: boolean | null;
  searchTerm?: string | null;
  isArchivedAt?: string | null;
  formListAuthoredFormDetail?: {} | null;
  formListFormDetail?: {} | null;
  isDeleted?: boolean | null;
  createdBy?: string | null;
  plantId?: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  pdfTemplateConfiguration?: any;
  instructions?: any;
};

export type UpdateAuthoredFormDetail = {
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formDetailPublishStatus?: string | null;
  formlistID: string;
  subForms?: string | null;
  hierarchy?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export type UpdateFormDetail = {
  id: string;
  formData?: string | null;
  formlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  flatHierarchy?: string | null;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  formSubmissionDetail?: {} | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export type CreateFormDetail = {
  id: string;
  formData?: string | null;
  formlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  flatHierarchy?: string | null;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  formSubmissionDetail?: {} | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export type CreateAuthoredFormDetail = {
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formDetailPublishStatus?: string | null;
  formlistID: string;
  subForms?: string | null;
  hierarchy?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};
