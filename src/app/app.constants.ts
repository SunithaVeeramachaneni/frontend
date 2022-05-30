export const routingUrls = {
  dashboard: { url: '/dashboard', title: 'Dashboard' },
  reports: { url: '/dashboard/reports', title: 'Reports' },
  maintenance: { url: '/maintenance', title: 'Maintenance Control Center' },
  spareParts: { url: '/spare-parts', title: 'Spare Parts Control Center' },
  workInstructions: {
    url: '/work-instructions',
    title: 'Work Instructions Authoring'
  },
  drafts: { url: '/work-instructions/drafts', title: 'Drafts' },
  favorites: { url: '/work-instructions/favorites', title: 'Favorites' },
  published: { url: '/work-instructions/published', title: 'Published' },
  recents: { url: '/work-instructions/recents', title: 'Recents' },
  files: { url: '/work-instructions/files', title: 'Files' },
  userManagement: { url: '/user-management', title: 'User Management' },
  rolesPermissions: {
    url: '/user-management/roles-permissions',
    title: 'Roles & Permissions'
  },
  inActiveUsers: {
    url: '/user-management/inactive-users',
    title: 'Inactive Users'
  },
  tenantManagement: { url: '/tenant-management', title: 'Tenant Management' },
  inActiveTenants: {
    url: '/tenant-management/inactive-tenants',
    title: 'Inactive Tenants'
  }
};

export const defaultCategoryId = '_UnassignedCategory_';
export const defaultCategoryName = 'Unassigned';
export const defaultLanguage = 'en';
export const defaultLimit = 25;
export const defaultCountFieldName = 'Record Count';
export const wrenchTimeName = 'Wrench Time';
export const pieColors = [
  'rgb(124, 57, 245)',
  'rgb(223, 170, 26)',
  'rgb(58, 218, 142)',
  'rgb(106, 157, 175)',
  'rgb(2, 73, 189)',
  'rgb(220, 67, 215)',
  'rgb(42, 67, 93)',
  'rgb(59, 230, 69)',
  'rgb(1, 46, 232)',
  'rgb(151, 186, 168)',
  'rgb(61, 238, 18)',
  'rgb(40, 107, 181)',
  'rgb(19, 90, 114)',
  'rgb(70, 165, 116)',
  'rgb(27, 180, 201)',
  'rgb(48, 175, 119)',
  'rgb(119, 55, 215)',
  'rgb(210, 238, 145)',
  'rgb(42, 186, 114)',
  'rgb(167, 244, 208)',
  'rgb(10, 208, 140)',
  'rgb(252, 33, 210)',
  'rgb(41, 40, 108)',
  'rgb(76, 93, 79)',
  'rgb(57, 164, 11)',
  'rgb(131, 140, 32)',
  'rgb(72, 95, 179)',
  'rgb(129, 93, 131)',
  'rgb(49, 219, 33)',
  'rgb(154, 140, 109)',
  'rgb(29, 98, 30)',
  'rgb(152, 189, 40)',
  'rgb(146, 6, 109)',
  'rgb(226, 165, 140)',
  'rgb(239, 173, 233)',
  'rgb(63, 188, 25)',
  'rgb(236, 182, 6)',
  'rgb(214, 46, 118)',
  'rgb(229, 245, 189)',
  'rgb(133, 77, 225)',
  'rgb(157, 255, 41)',
  'rgb(7, 55, 11)',
  'rgb(145, 244, 144)',
  'rgb(152, 185, 95)',
  'rgb(181, 130, 78)',
  'rgb(207, 168, 209)',
  'rgb(181, 205, 161)',
  'rgb(100, 198, 67)',
  'rgb(201, 92, 124)',
  'rgb(50, 217, 85)'
];
export const superAdminIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAwhJREFUSInF1W9o1WUUB/DPubuyDSp0OWbZH4QKGogQRGVYhlEvgmgx96JMUMRtmXvRS7VY9Wq+qBFh907If73QiKKEoJERmAYiSWUEEflCbFqWvkisuXufXtzfvdvdvdYIogM/nt/znPN8v+ec53AO/7HEXIxSwTIsFbpQws+mHItNfvjXBGmXNn8YEgaw5CpmJzGqw+7oU5ozQSq4D/txC5LkuHAYZzAPi7EK3RnK18Lq2Oj7fyRIRasl+9CKd+VsbXYR0pi7lW3HSlwQHo9+n1+VII1ZruxT5ITnot9YA+gbrpf3kVaPxjoXUxIKXhJewHll98Szfqza52oXX9WubH/m+VBT8GF5eQeEa2OdixAhxaAXMYKFwr6Uph2vEWi3GTfj/RhQaJYSi4xglWRPg+6sLfhSWK6op5GgUi1JydZm2OlNT+N5lCRvz9bHsLKcbRVjg3UEWZ0vwYnY5LsG8KK7hJ3Z9pMYdKZphPONS34RHkw7LIB8plqarYcbwN/S6Yr30J55dzoVrc7+S876MIZNQfQppYIjeELenTiaz9Jzg4TkpzrwYXmTDuDW6VzYINmQ7SZ0GsfvM65VMMpunI6gbEogtNS532UNHmqaDibl9MZAHTjVd41KVNVHnsjWm+pMz9mrrKP28dV0eIZio6NNiBfPxKxGcFwLwiMzLWNYGRcgFXRjWQa+JwYVZyOnonmSFbis3claBFlX/FZyW9rh3iZewdps/cIV/U0tynowH4dirUs1gkxeUzkZScN159I7WrAGE67ojSF/Nni/S5vwSrYdrZ5PA3XYrZLjB3TVDCvyq4fRKac3NtdXWk0mjeEOHIwBhxoIok9JSS9+E7akgu2Z5+RckjzV7FHTLm2paK/kGZwS1s/UN7brSkf9AAtxAtt0+Hj2QEmvazVPj/AybscpJY/N7gTNB85OS5Tsw/3Z0XkcEU5L8ipNcQWuy/QHhfXR7/xsrL+dyangScmgsNJ0W6nKZYxLRmPQZ1fDmNvQ32GB0I1FwpSyc67xTbUU/1f5C9zA9dtYdVIPAAAAAElFTkSuQmCC';

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
  deleteFile: 'DELETE_FILE'
});
