/* eslint-disable @typescript-eslint/naming-convention */
export const permissions = Object.freeze({
  viewDashboards: 'VIEW_DASHBOARDS',
  createDashboard: 'CREATE_DASHBOARD',
  updateDashboard: 'UPDATE_DASHBOARD',
  deleteDashboard: 'DELETE_DASHBOARD',
  copyDashboard: 'COPY_DASHBOARD',
  viewReports: 'VIEW_REPORTS',
  createReport: 'CREATE_REPORT',
  updateReport: 'UPDATE_REPORT',
  deleteReport: 'DELETE_REPORT',
  copyReport: 'COPY_REPORT',
  reportExportToExcel: 'REPORT_EXPORT_TO_EXCEL',
  viewTenants: 'VIEW_TENANTS',
  createTenant: 'CREATE_TENANT',
  updateTenant: 'UPDATE_TENANT',
  viewInactiveTenants: 'VIEW_INACTIVE_TENANTS',
  viewMaintenanceControlCenter: 'VIEW_MAINTENANCE_CONTROL_CENTER',
  assignWorkOrders: 'ASSIGN_WORK_ORDERS',
  viewSparePartsControlCenter: 'VIEW_SPARE_PARTS_CONTROL_CENTER',
  assignPickList: 'ASSIGN_PICKLIST',
  viewUsers: 'VIEW_USERS',
  createUser: 'CREATE_USER',
  updateUser: 'UPDATE_USER',
  deactivateUser: 'DEACTIVATE_USER',
  viewRoles: 'VIEW_ROLES',
  createRole: 'CREATE_ROLE',
  updateRole: 'UPDATE_ROLE',
  deleteRole: 'DELETE_ROLE',
  copyRole: 'COPY_ROLE',
  viewInactiveUsers: 'VIEW_INACTIVE_USERS',
  viewWorkInstructions: 'VIEW_WORK_INSTRUCTIONS',
  createWorkInstruction: 'CREATE_WORK_INSTRUCTION',
  updateWorkInstruction: 'UPDATE_WORK_INSTRUCTION',
  publishWorkInstruction: 'PUBLISH_WORK_INSTRUCTION',
  deleteWorkInstruction: 'DELETE_WORK_INSTRUCTION',
  importWorkInstruction: 'IMPORT_WORK_INSTRUCTION',
  copyWorkInstruction: 'COPY_WORK_INSTRUCTION',
  createCategory: 'CREATE_CATEGORY',
  updateCategory: 'UPDATE_CATEGORY',
  deleteCategory: 'DELETE_CATEGORY',
  viewFiles: 'VIEW_FILES',
  updateFile: 'UPDATE_FILE',
  deleteFile: 'DELETE_FILE',

  viewLocations: 'VIEW_LOCATIONS',
  createLocation: 'CREATE_LOCATION',
  updateLocation: 'UPDATE_LOCATION',
  deleteLocation: 'DELETE_LOCATION',
  importLocations: 'IMPORT_LOCATIONS',

  viewAssets: 'VIEW_ASSETS',
  createAsset: 'CREATE_ASSET',
  updateAsset: 'UPDATE_ASSET',
  deleteAsset: 'DELETE_ASSET',
  importAssets: 'IMPORT_ASSETS',
  viewPlants: 'VIEW_PLANTS',
  createPlant: 'CREATE_PLANT',
  updatePlant: 'UPDATE_PLANT',
  deletePlant: 'DELETE_PLANT',
  importPlants: 'IMPORT_PLANTS',
  viewShifts: 'VIEW_SHIFTS',
  createShift: 'CREATE_SHIFT',
  updateShift: 'UPDATE_SHIFT',
  viewForms: 'VIEW_FORMS',
  createForm: 'CREATE_FORM',
  updateForm: 'UPDATE_FORM',
  deleteForm: 'DELETE_FORM',
  copyForm: 'COPY_FORM',
  archiveForm: 'ARCHIVE_FORM',
  viewSubmissions: 'VIEW_SUBMISSIONS',
  downloadSubmission: 'DOWNLOAD_SUBMISSION',
  shareSubmission: 'SHARE_SUBMISSION',
  viewFormTemplates: 'VIEW_FORM_TEMPLATES',
  createFormTemplate: 'CREATE_FORM_TEMPLATE',
  updateFormTemplate: 'UPDATE_FORM_TEMPLATE',
  viewArchivedForms: 'VIEW_ARCHIVED_FORMS',
  viewFormScheduler: 'VIEW_FORM_SCHEDULER',
  scheduleInspection: 'SCHEDULE_FORM',

  viewORPlans: 'VIEW_OR_PLANS',
  createORPlan: 'CREATE_OR_PLAN',
  updateORPlan: 'UPDATE_OR_PLAN',
  deleteORPlan: 'DELETE_OR_FORM',
  copyRoundPlan: 'COPY_OR_PLAN',
  archiveRoundPlan: 'ARCHIVE_OR_PLAN',
  downloadRounds: 'DOWNLOAD_ROUNDS',
  shareRounds: 'SHARE_ROUNDS',
  viewScheduler: 'VIEW_SCHEDULER',
  scheduleRoundPlan: 'SCHEDULE_ROUND_PLAN',
  viewORPTemplates: 'VIEW_ORP_TEMPLATES',
  createORPTemplate: 'CREATE_ORP_TEMPLATES',
  updateORPTemplate: 'UPDATE_ORP_TEMPLATES',
  viewArchivedORP: 'VIEW_OR_ARCHIVED_PLANS',
  viewORObservations: 'VIEW_OR_OBSERVATIONS',

  viewUnitOfMeasurement: 'VIEW_UNIT_OF_MEASUREMENTS',
  createUnitOfMeasurement: 'CREATE_UNIT_OF_MEASUREMENT',
  updateUnitOfMeasurement: 'UPDATE_UNIT_OF_MEASUREMENT',
  deleteUnitOfMeasurement: 'DELETE_UNIT_OF_MEASUREMENT',
  importUnitOfMeasurement: 'IMPORT_UNIT_OF_MEASUREMENT',

  viewGlobalResponses: 'VIEW_GLOBAL_RESPONSES',
  createGlobalResponses: 'CREATE_GLOBAL_RESPONSES',
  updateGlobalResponses: 'UPDATE_GLOBAL_RESPONSES',
  deleteGlobalResponses: 'DELETE_GLOBAL_RESPONSES',
  importGlobalResponses: 'IMPORT_GLOBAL_RESPONSES',

  viewRdfObservations: 'VIEW_RDF_OBSERVATIONS'
});

export const routingUrls = {
  dashboard: {
    url: '/dashboard',
    title: 'Dashboard',
    permission: permissions.viewDashboards
  },
  myDashboard: {
    url: '/dashboard',
    title: 'My Dashboard',
    permission: permissions.viewDashboards
  },
  reports: {
    url: '/dashboard/reports',
    title: 'Reports',
    permission: permissions.viewReports
  },
  maintenance: {
    url: '/maintenance',
    title: 'Maintenance Control Center',
    permission: permissions.viewMaintenanceControlCenter
  },
  spareParts: {
    url: '/spare-parts',
    title: 'Spare Parts Control Center',
    permission: permissions.viewSparePartsControlCenter
  },
  workInstructions: {
    url: '/work-instructions',
    title: 'Work Instructions',
    permission: permissions.viewWorkInstructions
  },
  workInstructionsHome: {
    url: '/work-instructions',
    title: 'Work Instructions Authoring',
    permission: permissions.viewWorkInstructions
  },
  drafts: {
    url: '/work-instructions/drafts',
    title: 'Drafts',
    permission: permissions.viewWorkInstructions
  },
  favorites: {
    url: '/work-instructions/favorites',
    title: 'Favorites',
    permission: permissions.viewWorkInstructions
  },
  published: {
    url: '/work-instructions/published',
    title: 'Published',
    permission: permissions.viewWorkInstructions
  },
  recents: {
    url: '/work-instructions/recents',
    title: 'Recents',
    permission: permissions.viewWorkInstructions
  },
  files: {
    url: '/work-instructions/files',
    title: 'Files',
    permission: permissions.viewFiles
  },
  userManagement: {
    url: '/user-management',
    title: 'User Management',
    permission: permissions.viewUsers
  },
  activeUsers: {
    url: '/user-management',
    title: 'Active Users',
    permission: permissions.viewUsers
  },
  rolesPermissions: {
    url: '/user-management/roles-permissions',
    title: 'Roles & Permissions',
    permission: permissions.viewRoles
  },
  inActiveUsers: {
    url: '/user-management/inactive-users',
    title: 'Inactive Users',
    permission: permissions.viewInactiveUsers
  },
  tenantManagement: {
    url: '/tenant-management',
    title: 'Tenant Management',
    permission: permissions.viewTenants
  },
  inActiveTenants: {
    url: '/tenant-management/inactive-tenants',
    title: 'Inactive Tenants',
    permission: permissions.viewTenants
  },
  raceDynamicForms: {
    url: '/forms',
    title: 'Forms',
    permission: permissions.viewForms
  },
  myForms: {
    url: '/forms',
    title: 'My Forms',
    permission: permissions.viewForms
  },
  formsTemplates: {
    url: '/forms/templates',
    title: 'Templates',
    permission: permissions.viewFormTemplates
  },
  archivedForms: {
    url: '/forms/archived',
    title: 'Archived',
    permission: permissions.viewArchivedForms
  },

  schedularForms: {
    url: '/forms/scheduler/0',
    title: 'Scheduler',
    permission: permissions.viewFormScheduler
  },
  rdfObservations: {
    url: '/forms/observations',
    title: 'Observations',
    permission: permissions.viewRdfObservations
  },

  operatorRoundPlans: {
    url: '/operator-rounds',
    title: 'Operator Rounds',
    permission: permissions.viewORPlans
  },
  myRoundPlans: {
    url: '/operator-rounds',
    title: 'Round Plans',
    permission: permissions.viewORPlans
  },
  roundPlanScheduler: {
    url: '/operator-rounds/scheduler/0',
    title: 'Scheduler',
    permission: permissions.viewScheduler
  },
  roundPlanArchivedForms: {
    url: '/operator-rounds/archived',
    title: 'Archived',
    permission: permissions.viewArchivedORP
  },
  roundPlanObservations: {
    url: '/operator-rounds/observations',
    title: 'Observations',
    permission: permissions.viewORObservations
  },
  masterConfiguration: {
    url: '/master-configuration',
    title: 'Master Configuration',
    permission: permissions.viewPlants
  },
  plants: {
    url: '/master-configuration',
    title: 'Plants',
    permission: permissions.viewPlants
  },
  shifts: {
    url: '/master-configuration/shifts',
    title: 'Shifts',
    permission: permissions.viewShifts
  },
  locations: {
    url: '/master-configuration/locations',
    title: 'Locations',
    permission: permissions.viewLocations
  },
  assets: {
    url: '/master-configuration/assets',
    title: 'Assets',
    permission: permissions.viewAssets
  },
  unitOfMeasurement: {
    url: '/master-configuration/unit-measurement',
    title: 'Unit of Measurement',
    permission: permissions.viewUnitOfMeasurement
  },
  globalResponse: {
    url: '/master-configuration/global-response',
    title: 'Global Response Set',
    permission: permissions.viewGlobalResponses
  }
};
export const formConfigurationStatus = Object.freeze({
  draft: 'Draft',
  published: 'Published',
  publishing: 'Publishing',
  saved: 'Saved',
  saving: 'Saving',
  standalone: 'Standalone',
  embedded: 'Embedded',
  ready: 'Ready'
});

export const HIERARCHY_MODES = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ASSET_HIERARCHY: 'asset_hierarchy',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ROUTE_PLAN: 'route_plan'
});

export const defaultCategoryId = '_UnassignedCategory_';
export const defaultCategoryName = 'Unassigned';
export const defaultLanguage = 'en';
export const defaultLimit = 25;
export const graphQLDefaultLimit = 250;
export const graphQLDefaultMaxLimit = 10000;
export const graphQLRoundsOrInspectionsLimit = 50;
export const defaultCountFieldName = 'Record Count';
export const superAdminIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAwhJREFUSInF1W9o1WUUB/DPubuyDSp0OWbZH4QKGogQRGVYhlEvgmgx96JMUMRtmXvRS7VY9Wq+qBFh907If73QiKKEoJERmAYiSWUEEflCbFqWvkisuXufXtzfvdvdvdYIogM/nt/znPN8v+ec53AO/7HEXIxSwTIsFbpQws+mHItNfvjXBGmXNn8YEgaw5CpmJzGqw+7oU5ozQSq4D/txC5LkuHAYZzAPi7EK3RnK18Lq2Oj7fyRIRasl+9CKd+VsbXYR0pi7lW3HSlwQHo9+n1+VII1ZruxT5ITnot9YA+gbrpf3kVaPxjoXUxIKXhJewHll98Szfqza52oXX9WubH/m+VBT8GF5eQeEa2OdixAhxaAXMYKFwr6Uph2vEWi3GTfj/RhQaJYSi4xglWRPg+6sLfhSWK6op5GgUi1JydZm2OlNT+N5lCRvz9bHsLKcbRVjg3UEWZ0vwYnY5LsG8KK7hJ3Z9pMYdKZphPONS34RHkw7LIB8plqarYcbwN/S6Yr30J55dzoVrc7+S876MIZNQfQppYIjeELenTiaz9Jzg4TkpzrwYXmTDuDW6VzYINmQ7SZ0GsfvM65VMMpunI6gbEogtNS532UNHmqaDibl9MZAHTjVd41KVNVHnsjWm+pMz9mrrKP28dV0eIZio6NNiBfPxKxGcFwLwiMzLWNYGRcgFXRjWQa+JwYVZyOnonmSFbis3claBFlX/FZyW9rh3iZewdps/cIV/U0tynowH4dirUs1gkxeUzkZScN159I7WrAGE67ojSF/Nni/S5vwSrYdrZ5PA3XYrZLjB3TVDCvyq4fRKac3NtdXWk0mjeEOHIwBhxoIok9JSS9+E7akgu2Z5+RckjzV7FHTLm2paK/kGZwS1s/UN7brSkf9AAtxAtt0+Hj2QEmvazVPj/AybscpJY/N7gTNB85OS5Tsw/3Z0XkcEU5L8ipNcQWuy/QHhfXR7/xsrL+dyangScmgsNJ0W6nKZYxLRmPQZ1fDmNvQ32GB0I1FwpSyc67xTbUU/1f5C9zA9dtYdVIPAAAAAElFTkSuQmCC';
export const superAdminText = 'Super Admin';
export const userRolePermissions = 'UserRolePermissions';
export const defaultProfile = 'assets/user-management-icons/Vector.png';
export const products = ['MWORKORDER', 'MINVENTORY'];
export const LIST_LENGTH = 20000000;
export const dateFormat = 'MMM dd, yy';

export const DEFAULT_PDF_BUILDER_CONFIG = {
  formId: true,
  formTitle: true,
  subject: true,
  logo: true,
  questionCompleted: true,
  submittedOn: true,
  submittedBy: true,
  pdfGeneratedDate: true,
  customText: true,
  customTextLabel: '',
  customTextField: '',
  actions: true,
  issues: true,
  questions: true,
  incompleteQuestions: true,
  completedQuestions: true,
  capturedQuestions: true,
  photos: true,
  skippedQuestions: true
};
export const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
export const EXCEL_EXTENSION = '.xlsx';
export const DEFAULT_TEMPLATE_PAGES = [
  {
    name: 'Page',
    position: 1,
    isOpen: true,
    sections: [
      {
        id: 'S1',
        name: 'Section',
        position: 1,
        isOpen: true
      }
    ],
    questions: [
      {
        id: 'Q1',
        sectionId: 'S1',
        name: 'Site Conducted',
        fieldType: 'TF',
        position: 1,
        required: false,
        enableHistory: false,
        multi: false,
        value: 'TF',
        isPublished: false,
        isPublishedTillSave: false,
        isOpen: true,
        isResponseTypeModalOpen: false,
        unitOfMeasurement: 'None',
        rangeMetadata: {}
      },
      {
        id: 'Q2',
        sectionId: 'S1',
        name: 'Conducted On',
        fieldType: 'DT',
        position: 2,
        required: false,
        enableHistory: false,
        multi: false,
        value: 'TF',
        isPublished: false,
        isPublishedTillSave: false,
        isOpen: true,
        isResponseTypeModalOpen: false,
        unitOfMeasurement: 'None',
        rangeMetadata: {},
        date: true,
        time: true
      },
      {
        id: 'Q3',
        sectionId: 'S1',
        name: 'Performed By',
        fieldType: 'TF',
        position: 3,
        required: false,
        enableHistory: false,
        multi: false,
        value: 'TF',
        isPublished: false,
        isPublishedTillSave: false,
        isOpen: true,
        isResponseTypeModalOpen: false,
        unitOfMeasurement: 'None',
        rangeMetadata: {}
      },
      {
        id: 'Q4',
        sectionId: 'S1',
        name: 'Location',
        fieldType: 'GAL',
        position: 4,
        required: false,
        enableHistory: false,
        multi: false,
        value: 'TF',
        isPublished: false,
        isPublishedTillSave: false,
        isOpen: true,
        isResponseTypeModalOpen: false,
        unitOfMeasurement: 'None',
        rangeMetadata: {}
      }
    ],
    logics: []
  }
];

export const responseCount = 1000;
