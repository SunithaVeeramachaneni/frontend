use cwp-tenants;

create table catalog(
   id INT NOT NULL AUTO_INCREMENT,
   tenantId VARCHAR(255) NOT NULL,
   tenantName VARCHAR(100) NOT NULL,
   tenantDate DATE NOT NULL,
   tenantIdp VARCHAR(255) NOT NULL,
   clientId VARCHAR(255) NOT NULL,
   authority VARCHAR(255) NOT NULL,
   identityMetadata VARCHAR(255) NOT NULL,
   redirectUri VARCHAR(255) NOT NULL,
   sapProtectedResources JSON,
   nodeProtectedResources JSON,
   tenantDomianName VARCHAR(100) NOT NULL,
   saml JSON,
   sap JSON,
   PRIMARY KEY ( id ),
   UNIQUE (tenantId)
);

create table tenant(
   id INT NOT NULL AUTO_INCREMENT,
   catalogId INT,
   tenantSpecificProducts JSON NOT NULL,
   tenantLogLevel VARCHAR(50) NOT NULL,
   PRIMARY KEY ( id ),
   FOREIGN KEY (catalogId) REFERENCES catalog(id)
);
