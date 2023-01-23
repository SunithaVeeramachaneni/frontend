// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { AuthoredRoundPlanDetail, RoundPlanDetail, RoundPlansList, ResponseSet, FormSubmissionDetail, AuthoredFormDetail, FormSubmissionList, FormList, FormDetail } = initSchema(schema);

export {
  AuthoredRoundPlanDetail,
  RoundPlanDetail,
  RoundPlansList,
  ResponseSet,
  FormSubmissionDetail,
  AuthoredFormDetail,
  FormSubmissionList,
  FormList,
  FormDetail
};