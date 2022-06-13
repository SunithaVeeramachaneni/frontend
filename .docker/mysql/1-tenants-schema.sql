use CWPCatalog;

create table catalogs(
  id INT NOT NULL AUTO_INCREMENT,
  tenantId VARCHAR(100) NOT NULL,
  tenantName VARCHAR(100) NOT NULL,
  tenantIdp VARCHAR(50) NOT NULL,
  clientId VARCHAR(100) NOT NULL,
  authority VARCHAR(255) NOT NULL,
  redirectUri VARCHAR(100) NOT NULL,
  tenantDomainName VARCHAR(100) NOT NULL,
  tenantAdmin JSON NOT NULL,
  erps JSON NOT NULL,
  protectedResources JSON NOT NULL,
  rdbms JSON NOT NULL,
  nosql JSON NOT NULL,
  noOfLicenses INT NOT NULL,
  products JSON NOT NULL,
  modules JSON NOT NULL,
  logDBType VARCHAR(20) NOT NULL,
  logLevel VARCHAR(20) NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdBy VARCHAR(100) NOT NULL,
  updatedBy VARCHAR(100) NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NULL,
  slackTeamID VARCHAR(100) NOT NULL,
  PRIMARY KEY ( id ),
  UNIQUE (tenantId),
  UNIQUE (tenantName),
  UNIQUE (tenantDomainName)
);

