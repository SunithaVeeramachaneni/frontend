conn = new Mongo();
db = conn.getDB('cwpdev-wi');

db.categories.insertOne({
  _id: '_UnassignedCategory_',
  Category_Name: 'Unassigned',
  Cover_Image:
    'assets/work-instructions-icons/img/brand/category-placeholder.png',
  Created_At: new Date(),
  Updated_At: new Date()
});

db = conn.getDB('cwp');

db.tenants.insertOne({
  tenantId: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723',
  tenantName: 'localhost',
  tenantDate: '',
  tenantIdp: 'azure',
  clientId: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
  authority:
    'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
  redirectUri: 'http://localhost:4200/',
  sapProtectedResources: {
    urls: ['http://localhost:8002/', 'http://localhost:8003/'],
    scope: 'api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access'
  },
  nodeProtectedResources: {
    urls: [
      'http://localhost:8001/',
      'http://localhost:8004/',
      'http://localhost:8007/'
    ],
    scope: 'api://9d93f9da-6989-4aea-b59f-c26e06a2ef91/access_as_user'
  },
  nsb100: {
    idp: {
      oauth2Url:
        'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      clientSecret: 'nR78QGa15.d6C8dOh1_coeG.ECDB.I_VJh',
      resource: 'https://NSB100',
      tokenUse: 'on_behalf_of',
      tokenType: 'urn:ietf:params:oauth:token-type:saml2'
    },
    sap: {
      baseUrl: 'https://3.213.12.206/sap/opu/odata/INVCEC/RACE_SRV/',
      oauth2Url: 'https://3.213.12.206/sap/bc/sec/oauth2/token',
      username: 'cwpuser',
      password: 'U2FsdGVkX191+esL7KaKroQwIBfmBFbPEXyKLiJbDqs=',
      grantType: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
      clientId: 'cwpuser',
      scope: '/INVCEC/RACE_SRV_0001'
    }
  },
  nts100: {
    idp: {
      oauth2Url:
        'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      clientSecret: 'nR78QGa15.d6C8dOh1_coeG.ECDB.I_VJh',
      resource: 'https://NTS100',
      tokenUse: 'on_behalf_of',
      tokenType: 'urn:ietf:params:oauth:token-type:saml2'
    },
    sap: {
      baseUrl:
        'https://nts.innovapptive.com:8080/sap/opu/odata/INVCEC/RACE_SRV/',
      oauth2Url: 'https://nts.innovapptive.com:8080/sap/bc/sec/oauth2/token',
      username: 'cwpuser',
      password: 'U2FsdGVkX191+esL7KaKroQwIBfmBFbPEXyKLiJbDqs=',
      grantType: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
      clientId: 'cwpuser',
      scope: '/INVCEC/RACE_SRV_0001'
    }
  },
  mWorkorder: {
    idp: {
      oauth2Url:
        'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      clientSecret: 'nR78QGa15.d6C8dOh1_coeG.ECDB.I_VJh',
      resource: 'https://NSB100',
      tokenUse: 'on_behalf_of',
      tokenType: 'urn:ietf:params:oauth:token-type:saml2'
    },
    sap: {
      baseUrl:
        'http://innongwtst.internal.innovapptive.com:8000/sap/opu/odata/INVMWO/MWORKORDER_SRV/',
      oauth2Url:
        'http://innongwtst.internal.innovapptive.com:8000/sap/bc/sec/oauth2/token',
      username: 'cwpuser',
      password: 'U2FsdGVkX191+esL7KaKroQwIBfmBFbPEXyKLiJbDqs=',
      grantType: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
      clientId: 'cwpuser',
      scope: '/INVCEC/RACE_SRV_0001'
    }
  },
  mInventory: {
    idp: {
      oauth2Url:
        'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      clientSecret: 'nR78QGa15.d6C8dOh1_coeG.ECDB.I_VJh',
      resource: 'https://NSB100',
      tokenUse: 'on_behalf_of',
      tokenType: 'urn:ietf:params:oauth:token-type:saml2'
    },
    sap: {
      baseUrl:
        'http://innongwtst.internal.innovapptive.com:8000/sap/opu/odata/INVMIM/MINVENTORY_2_SRV/',
      oauth2Url:
        'http://innongwtst.internal.innovapptive.com:8000/sap/bc/sec/oauth2/token',
      username: 'cwpuser',
      password: 'U2FsdGVkX191+esL7KaKroQwIBfmBFbPEXyKLiJbDqs=',
      grantType: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
      clientId: 'cwpuser',
      scope: '/INVCEC/RACE_SRV_0001'
    }
  },
  race: {
    idp: {
      oauth2Url:
        'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/oauth2/token',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      clientSecret: 'nR78QGa15.d6C8dOh1_coeG.ECDB.I_VJh',
      resource: 'https://NSB100',
      tokenUse: 'on_behalf_of',
      tokenType: 'urn:ietf:params:oauth:token-type:saml2'
    },
    sap: {
      baseUrl:
        'http://innongwtst.internal.innovapptive.com:8000/sap/opu/odata/INVCEC/RACE_SRV/',
      oauth2Url:
        'http://innongwtst.internal.innovapptive.com:8000/sap/bc/sec/oauth2/token',
      username: 'cwpuser',
      password: 'U2FsdGVkX191+esL7KaKroQwIBfmBFbPEXyKLiJbDqs=',
      grantType: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
      clientId: 'cwpuser',
      scope: '/INVCEC/RACE_SRV_0001'
    }
  }
});
