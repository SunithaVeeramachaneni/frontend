use cwp_tenants;

insert into catalog (
  tenantId,
  tenantName,
  tenantDate,
  tenantIdp,
  clientId,
  authority,
  identityMetadata,
  redirectUri,
  sapProtectedResources,
  nodeProtectedResources,
  tenantDomianName,
  saml,
  sap
) values(
  "f8e6f04b-2b9f-43ab-ba8a-b4c367088723",
  "localhost",
  "2022-04-05",
  "azure",
  "06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
  "https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0",
  "https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0/.well-known/openid-configuration",
  "http://localhost:4200/",
  '[
    ["http://localhost:8002/", "http://localhost:8003/"],
    "api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access"
  ]',
  '[
    [
      ["http://localhost:8001/", "http://localhost:8004/"],
      "api://09b861a8-8458-4630-9c18-36c00c43e9b0/access_as_user"
    ]
  ]',
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
  }'
);
