use CWPCatalog;

insert into catalogs (
  tenantId,
  tenantName,
  tenantIdp,
  clientId,
  authority,
  redirectUri,
  tenantDomainName,
  tenantAdmin,
  erps,
  protectedResources,
  rdbms,
  nosql,
  noOfLicenses,
  products,
  modules,
  logDBType,
  logLevel,
  createdBy,
  createdAt,
  slackTeamID
) values(
  "f8e6f04b-2b9f-43ab-ba8a-b4c367088723",
  "Innovapptive",
  "azure",
  "06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
  "https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0",
  "http://localhost:4200/",
  "innovapptive.com",
  '{
    "firstName": "tenant",
    "lastName": "admin",
    "title": "Super Admin",
    "email": "tenant.admin@innovapptive.com"
  }',
  '{
    "sap": {
      "baseUrl": "https://10.0.0.111/sap/opu/odata/INVCEC/RACE_SRV/",
      "oauth2Url": "https://10.0.0.111/sap/bc/sec/oauth2/token",
      "username": "cwpuser",
      "password": "",
      "grantType": "urn:ietf:params:oauth:grant-type:saml2-bearer",
      "clientId": "cwpuser",
      "scope": {
        "race": "/INVCEC/RACE_SRV_0001",
        "mWorkOrder": "/INVMWO/MWORKORDER_SRV_0001",
        "mInventory": "/INVMIM/MINVENTORY_2_SRV_0001"
      },
      "saml": {
        "oauth2Url":
        "https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token",
        "grantType": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "clientSecret": "",
        "resource": "https://NSB100",
        "tokenUse": "on_behalf_of",
        "tokenType": "urn:ietf:params:oauth:token-type:saml2"
      }
    }
  }',
  '{
    "sap": {
      "identityMetadata": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/.well-known/openid-configuration",
      "issuer": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/",
      "clientId": "06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
      "audience": "api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc",
      "scope": "api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access",
      "urls": [
        "http://localhost:8002/",
        "http://localhost:8003/",
        "https://cwpdev.innovapptive.com/wiabapapi/",
        "http://cwpdev.innovapptive.com/wiabapapi/",
        "https://cwpdev.innovapptive.com/mccspccabapapi/",
        "http://cwpdev.innovapptive.com/mccspccabapapi/"
      ]
    },
    "node": {
      "identityMetadata": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/.well-known/openid-configuration",
      "issuer": "https://sts.windows.net/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/",
      "clientId": "9d93f9da-6989-4aea-b59f-c26e06a2ef91",
      "audience": "api://9d93f9da-6989-4aea-b59f-c26e06a2ef91",
      "scope": "api://9d93f9da-6989-4aea-b59f-c26e06a2ef91/access_as_user",
      "urls": [
        "http://localhost:8001/",
        "http://localhost:8004/",
        "http://localhost:8007/",
        "https://cwpdev.innovapptive.com/wiapi/",
        "http://cwpdev.innovapptive.com/wiapi/",
        "https://cwpdev.innovapptive.com/dashboardapi/",
        "http://cwpdev.innovapptive.com/dashboardapi/",
        "https://cwpdev.innovapptive.com/userrolemanagementapi/",
        "http://cwpdev.innovapptive.com/users",
        "http://cwpdev.innovapptive.com/roles",
        "http://cwpdev.innovapptive.com/permissions",
        "http://cwpdev.innovapptive.com/catalogs",
        "http://cwpdev.innovapptive.com/me",
        "http://cwpdev.innovapptive.com/slack"
      ]
    }
  }',
  '{
    "host": "mysql-local",
    "port": 3306,
    "user": "admin",
    "password": "",
    "database": "Innovapptive",
    "dialect": "mysql"
  }',
  '{
    "host": "mongo-local",
    "port": 27017,
    "user": "admin",
    "password": "",
    "database": "Innovapptive"
  }',
  20,
  '["MWORKORDER", "MINVENTORY"]',
  '["Dashboard", "Tenant Management", "Maintenance Control Center", "Spare Parts Control Center", "User Management", "Work Instructions Authoring"]',
  "rdbms",
  "off",
  "admin@innovapptive.com",
  "2022-05-10 12:00:00",
  "T78857ZCK"
);

CREATE DATABASE Innovapptive;
