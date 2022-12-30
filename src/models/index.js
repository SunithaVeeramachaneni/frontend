// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const FormStatusEnum = {
  "DRAFT": "DRAFT",
  "PUBLISHED": "PUBLISHED"
};

const { FormDetail, FormList, AuthoredFormDetail, FormInspection, FormsMetaData, FormsJSON } = initSchema(schema);

export {
  FormDetail,
  FormList,
  AuthoredFormDetail,
  FormInspection,
  FormsMetaData,
  FormsJSON,
  FormStatusEnum
};