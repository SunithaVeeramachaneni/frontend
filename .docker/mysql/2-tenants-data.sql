use cwp_tenant;

insert into catalogs (
  tenantId,
  tenantName,
  tenantIdp,
  clientId,
  authority,
  redirectUri,
  sapProtectedResources,
  nodeProtectedResources,
  tenantDomainName,
  saml,
  sap,
  createdOn
) values(
  "f8e6f04b-2b9f-43ab-ba8a-b4c367088723",
  "innovapptive",
  "azure",
  "06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
  "https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0",
  "http://localhost:4200/",
  '{
    "identityMetadata": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/.well-known/openid-configuration",
    "issuer": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/",
    "clientID": "06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
    "audience": "api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
    "scope": "api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access",
    "urls": [
      "http://localhost:8002/",
      "http://localhost:8003/",
      "https://cwpdev.innovapptive.com/wiabapapi/",
      "https://cwpdev.innovapptive.com/mccspccabapapi/",
      "https://cwpqa.innovapptive.com/wiabapapi/",
      "https://cwpqa.innovapptive.com/mccspccabapapi/"
    ]
  }',
  '{
    "identityMetadata": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/.well-known/openid-configuration",
    "issuer": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/",
    "clientID": "9d93f9da-6989-4aea-b59f-c26e06a2ef91",
    "audience": "api://9d93f9da-6989-4aea-b59f-c26e06a2ef91",
    "scope": "api://9d93f9da-6989-4aea-b59f-c26e06a2ef91/access_as_user",
    "urls": [
      "http://localhost:8001/",
      "http://localhost:8004/",
      "https://cwpdev.innovapptive.com/wiapi/",
      "https://cwpdev.innovapptive.com/dashboardapi/",
      "https://cwpqa.innovapptive.com/wiapi/",
      "https://cwpqa.innovapptive.com/dashboardapi/"
    ]
  }',
  "innovapptive.com",
  '{
    "oauth2Url":
      "https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token",
    "grantType": "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "clientSecret": "L2y7Q~SiOSKHJmmgiokIaL8PFl~gA8kTDvR74",
    "resource": "https://NSB100",
    "tokenUse": "on_behalf_of",
    "tokenType": "urn:ietf:params:oauth:token-type:saml2"
  }',
  '{
    "baseUrl": "https://10.0.0.111/sap/opu/odata/INVCEC/RACE_SRV/",
    "oauth2Url": "https://10.0.0.111/sap/bc/sec/oauth2/token",
    "username": "cwpuser",
    "password": "123456",
    "grantType": "urn:ietf:params:oauth:grant-type:saml2-bearer",
    "clientId": "cwpuser",
    "scope": "/INVCEC/RACE_SRV_0001"
  }',
  "2022-04-11 10:00:00"
);

insert into tenants (
  catalogId,
  products,
  dbType,
  logLevel,
  createdOn
) values (1, '["wi"]', "nosql", "error", "2022-04-11 10:00:00");
