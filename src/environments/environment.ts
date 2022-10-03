// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: true,
  dashboardApiUrl: 'https://cwpqa.innovapptive.com/dashboardapi/',
  mccAbapApiUrl: 'https://cwpqa.innovapptive.com/mccspccabapapi/',
  spccAbapApiUrl: 'https://cwpqa.innovapptive.com/mccspccabapapi/',
  wiApiUrl: 'https://cwpqa.innovapptive.com/wiapi/',
  wiAbapApiUrl: 'https://cwpqa.innovapptive.com/wiabapapi/',
  userRoleManagementApiUrl:
    'https://cwpqa.innovapptive.com/userrolemanagementapi/',
  s3BaseUrl: 'https://innovwi.s3.ap-south-1.amazonaws.com/',
  requestTimeout: 60000 * 3,
  undoRedoOffset: 5,
  jaasAppID: 'vpaas-magic-cookie-c9a785fe985444a18ba0c24416de0d6c'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
