// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const FormStatusEnum = {
  "DRAFT": "DRAFT",
  "PUBLISHED": "PUBLISHED"
};

const { FormSubmissionDetail, FormSubmissions, FormList, FormDetail, AuthoredFormDetail } = initSchema(schema);

export {
  FormSubmissionDetail,
  FormSubmissions,
  FormList,
  FormDetail,
  AuthoredFormDetail,
  FormStatusEnum
};