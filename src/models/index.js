// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Plants, ActionsLogHistory, ActionsList, IssuesLogHistory, IssuesList, UnitMeasument, UnitList, Assets, Location, RoundPlanSubmissionDetails, RoundPlanSubmissionList, AuthoredRoundPlanDetail, RoundPlanDetail, RoundPlanList, ResponseSet, FormSubmissionDetail, AuthoredFormDetail, FormSubmissionList, FormList, FormDetail } = initSchema(schema);

export {
  Plants,
  ActionsLogHistory,
  ActionsList,
  IssuesLogHistory,
  IssuesList,
  UnitMeasument,
  UnitList,
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