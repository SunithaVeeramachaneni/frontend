// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Assets, Location, RoundPlanSubmissionDetails, RoundPlanSubmissionList, AuthoredRoundPlanDetail, RoundPlanDetail, RoundPlanList, ResponseSet, FormSubmissionDetail, AuthoredFormDetail, FormSubmissionList, FormList, FormDetail } = initSchema(schema);

export {
  Assets,
  Location,
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