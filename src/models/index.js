// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ResponseSet, FormDetail, AuthoredFormDetail, FormSubmissionDetail, FormSubmissionList, FormList } = initSchema(schema);

export {
  ResponseSet,
  FormDetail,
  AuthoredFormDetail,
  FormSubmissionDetail,
  FormSubmissionList,
  FormList
};