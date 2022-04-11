use cwp_tenant;

create table catalogs(
  id INT NOT NULL AUTO_INCREMENT,
  tenantId VARCHAR(255) NOT NULL,
  tenantName VARCHAR(100) NOT NULL,
  tenantIdp VARCHAR(255) NOT NULL,
  clientId VARCHAR(255) NOT NULL,
  authority VARCHAR(255) NOT NULL,
  redirectUri VARCHAR(255) NOT NULL,
  sapProtectedResources JSON,
  nodeProtectedResources JSON,
  tenantDomainName VARCHAR(100) NOT NULL,
  saml JSON,
  sap JSON,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (tenantId),
  UNIQUE (tenantName)
);

create table tenants(
  id INT NOT NULL AUTO_INCREMENT,
  catalogId INT NOT NULL,
  products JSON NOT NULL,
  dbType VARCHAR(50) NOT NULL,
  logLevel VARCHAR(50) NOT NULL,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NULL,
  PRIMARY KEY ( id ),
  INDEX idx_tenant_catalog (catalogId),
  CONSTRAINT fk_tenant_catalog FOREIGN KEY (catalogId) REFERENCES catalogs(id)
);
