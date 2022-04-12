create table users(
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  profileImage BLOB NOT NULL,
  isActive BOOLEAN default true,
  isDeleted BOOLEAN default false,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (email)
);

create table roles(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (name)
);

create table permissions(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  displayName VARCHAR(255) NOT NULL,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NULL,
  PRIMARY KEY ( id ),
  UNIQUE (name),
  UNIQUE (displayName)
);

create table users_roles(
  userId INT NOT NULL,
  roleId INT NOT NULL,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NOT NULL,
  PRIMARY KEY (userId, roleId),
  INDEX idx_rp_user (userId),
  INDEX idx_rp_role (roleId),
  CONSTRAINT fk_ur_user FOREIGN KEY (userId) REFERENCES users(id),
  CONSTRAINT fk_ur_role FOREIGN KEY (roleId) REFERENCES roles(id)
);

create table roles_permissions(
  roleId INT NOT NULL,
  permissionId INT NOT NULL,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NOT NULL,
  PRIMARY KEY (roleId,  permissionId),
  INDEX idx_rp_role (roleId),
  INDEX idx_rp_permission (permissionId),
  CONSTRAINT fk_rp_role FOREIGN KEY (roleId) REFERENCES roles(id),
  CONSTRAINT fk_rp_permission FOREIGN KEY (permissionId) REFERENCES permissions(id)
);
