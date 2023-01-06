// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { FormDetail, AuthoredFormDetail, FormSubmissionDetail, FormSubmissionList, FormList } = initSchema(schema);

export {
  FormDetail,
  AuthoredFormDetail,
  FormSubmissionDetail,
  FormSubmissionList,
  FormList
};