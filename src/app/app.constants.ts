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

  viewForms: 'VIEW_FORMS',
  createForm: 'CREATE_FORM',
  updateForm: 'UPDATE_FORM',
  deleteForm: 'DELETE_FORM',
  viewSubmissions: 'VIEW_SUBMISSIONS',
  downloadSubmission: 'DOWNLOAD_SUBMISSION',
  shareSubmission: 'SHARE_SUBMISSION',
  viewTemplates: 'VIEW_TEMPLATES',
  viewArchivedForms: 'VIEW_ARCHIVED_FORMS'

  // viewORPlans: 'VIEW_PLANS',
  // createORPlan: 'CREATE_OR_PLAN',
  // updateORPlan: 'UPDATE_OR_PLAN',
  // deleteORPlan: 'DELETE_FORM',
  // viewORPlanSubmissions: 'VIEW_PLAN_SUBMISSIONS',
  // downloadORPSubmission: 'DOWNLOAD_SUBMISSION',
  // shareORPSubmission: 'SHARE_SUBMISSION',
  // viewORPTemplates: 'VIEW_TEMPLATES',
  // viewArchivedORP: 'VIEW_ARCHIVED_FORMS'
});

export const routingUrls = {
  dashboard: {
    url: '/dashboard',
    title: 'Dashboard',
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
  submissionForms: {
    url: '/forms/submissions',
    title: 'Submissions',
    permission: permissions.viewForms
  },
  archivedForms: {
    url: '/forms/archived',
    title: 'Archived',
    permission: permissions.viewForms
  },

  operatorRoundPlans: {
    url: '/operator-rounds',
    title: 'Operator Rounds',
    permission: permissions.viewForms
  },
  myRoundPlans: {
    url: '/operator-rounds',
    title: 'My Plans',
    permission: permissions.viewForms
  },
  roundPlanSubmissions: {
    url: '/operator-rounds/submissions',
    title: 'Submissions',
    permission: permissions.viewForms
  }
};

export const formConfigurationStatus = Object.freeze({
  draft: 'Draft',
  published: 'Published',
  publishing: 'Publishing',
  saved: 'Saved',
  saving: 'Saving',
  standalone: 'Standalone',
  embedded: 'Embedded'
});

export const defaultCategoryId = '_UnassignedCategory_';
export const defaultCategoryName = 'Unassigned';
export const defaultLanguage = 'en';
export const defaultLimit = 25;
export const defaultCountFieldName = 'Record Count';
export const superAdminIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAwhJREFUSInF1W9o1WUUB/DPubuyDSp0OWbZH4QKGogQRGVYhlEvgmgx96JMUMRtmXvRS7VY9Wq+qBFh907If73QiKKEoJERmAYiSWUEEflCbFqWvkisuXufXtzfvdvdvdYIogM/nt/znPN8v+ec53AO/7HEXIxSwTIsFbpQws+mHItNfvjXBGmXNn8YEgaw5CpmJzGqw+7oU5ozQSq4D/txC5LkuHAYZzAPi7EK3RnK18Lq2Oj7fyRIRasl+9CKd+VsbXYR0pi7lW3HSlwQHo9+n1+VII1ZruxT5ITnot9YA+gbrpf3kVaPxjoXUxIKXhJewHll98Szfqza52oXX9WubH/m+VBT8GF5eQeEa2OdixAhxaAXMYKFwr6Uph2vEWi3GTfj/RhQaJYSi4xglWRPg+6sLfhSWK6op5GgUi1JydZm2OlNT+N5lCRvz9bHsLKcbRVjg3UEWZ0vwYnY5LsG8KK7hJ3Z9pMYdKZphPONS34RHkw7LIB8plqarYcbwN/S6Yr30J55dzoVrc7+S876MIZNQfQppYIjeELenTiaz9Jzg4TkpzrwYXmTDuDW6VzYINmQ7SZ0GsfvM65VMMpunI6gbEogtNS532UNHmqaDibl9MZAHTjVd41KVNVHnsjWm+pMz9mrrKP28dV0eIZio6NNiBfPxKxGcFwLwiMzLWNYGRcgFXRjWQa+JwYVZyOnonmSFbis3claBFlX/FZyW9rh3iZewdps/cIV/U0tynowH4dirUs1gkxeUzkZScN159I7WrAGE67ojSF/Nni/S5vwSrYdrZ5PA3XYrZLjB3TVDCvyq4fRKac3NtdXWk0mjeEOHIwBhxoIok9JSS9+E7akgu2Z5+RckjzV7FHTLm2paK/kGZwS1s/UN7brSkf9AAtxAtt0+Hj2QEmvazVPj/AybscpJY/N7gTNB85OS5Tsw/3Z0XkcEU5L8ipNcQWuy/QHhfXR7/xsrL+dyangScmgsNJ0W6nKZYxLRmPQZ1fDmNvQ32GB0I1FwpSyc67xTbUU/1f5C9zA9dtYdVIPAAAAAElFTkSuQmCC';
export const superAdminText = 'Super Admin';
export const userRolePermissions = 'UserRolePermissions';
export const defaultProfile = 'assets/user-management-icons/Vector.png';
export const bigInnovaIcon = 'assets/sidebar-icons/innova-big.svg';
export const smallInnovaIcon = 'assets/sidebar-icons/innova-small.svg';
export const products = ['MWORKORDER', 'MINVENTORY'];
