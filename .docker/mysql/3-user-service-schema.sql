create database Innovapptive;

use Innovapptive;

create table users(
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  profileImage BLOB NOT NULL,
  isActive BOOLEAN default true,
  createdBy INT NOT NULL,
  updatedBy INT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (email),
  CONSTRAINT fk_users_createdBy FOREIGN KEY (createdBy) REFERENCES users(id),
  CONSTRAINT fk_users_updatedBy FOREIGN KEY (updatedBy) REFERENCES users(id)
);

create table roles(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  createdBy INT NOT NULL,
  updatedBy INT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (name),
  CONSTRAINT fk_roles_users_createdBy FOREIGN KEY (createdBy) REFERENCES users(id),
  CONSTRAINT fk_roles_users_updatedBy FOREIGN KEY (updatedBy) REFERENCES users(id)
);

create table permissions(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  displayName VARCHAR(255) NOT NULL,
  moduleName VARCHAR(100) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (name),
  UNIQUE (displayName, moduleName)
);

create table users_roles(
  userId INT NOT NULL,
  roleId INT NOT NULL,
  createdBy INT NOT NULL,
  updatedBy INT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY (userId, roleId),
  INDEX idx_rp_users (userId),
  INDEX idx_rp_roles (roleId),
  CONSTRAINT fk_ur_users FOREIGN KEY (userId) REFERENCES users(id),
  CONSTRAINT fk_ur_roles FOREIGN KEY (roleId) REFERENCES roles(id),
  CONSTRAINT fk_ur_users_createdBy FOREIGN KEY (createdBy) REFERENCES users(id),
  CONSTRAINT fk_ur_users_updatedBy FOREIGN KEY (updatedBy) REFERENCES users(id)
);

create table roles_permissions(
  roleId INT NOT NULL,
  permissionId INT NOT NULL,
  createdBy INT NOT NULL,
  updatedBy INT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY (roleId,  permissionId),
  INDEX idx_rp_roles (roleId),
  INDEX idx_rp_permissions (permissionId),
  CONSTRAINT fk_rp_roles FOREIGN KEY (roleId) REFERENCES roles(id),
  CONSTRAINT fk_rp_permissions FOREIGN KEY (permissionId) REFERENCES permissions(id),
  CONSTRAINT fk_rp_users_createdBy FOREIGN KEY (createdBy) REFERENCES users(id),
  CONSTRAINT fk_rp_users_updatedBy FOREIGN KEY (updatedBy) REFERENCES users(id)
);
