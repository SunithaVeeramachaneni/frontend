// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Notifications, RoundPlanSubmissionDetails, RoundPlanSubmissionList, AuthoredRoundPlanDetail, RoundPlanDetail, RoundPlanList, ResponseSet, FormSubmissionDetail, AuthoredFormDetail, FormSubmissionList, FormList, FormDetail } = initSchema(schema);

export {
  Notifications,
  RoundPlanSubmissionDetails,
  RoundPlanSubmissionList,
  AuthoredRoundPlanDetail,
  RoundPlanDetail,
  RoundPlanList,
  ResponseSet,
  FormSubmissionDetail,
  AuthoredFormDetail,
  FormSubmissionList,
  FormList,
  FormDetail
};