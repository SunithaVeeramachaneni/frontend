// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  dashboardApiUrl: 'http://localhost:8004/',
  mccAbapApiUrl: 'http://localhost:8003/',
  spccAbapApiUrl: 'http://localhost:8003/',
  wiApiUrl: 'http://localhost:8001/',
  wiAbapApiUrl: 'http://localhost:8002/',
  userRoleManagementApiUrl: 'http://localhost:8007/',
  rdfApiUrl: 'http://localhost:8008/',
  masterConfigApiUrl: 'http://localhost:8009/',
  operatorRoundsApiUrl: 'http://localhost:8010/',
  integrationsApiUrl: 'http://localhost:8011/',
  s3BaseUrl: 'https://innovwi.s3.ap-south-1.amazonaws.com/',
  requestTimeout: 60000 * 15,
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
