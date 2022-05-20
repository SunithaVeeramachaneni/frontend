export interface Role {
  id: number;
  name: string;
  description: string;
  permissionIds: any[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface RoleWithoutID {
  name: string;
  description: string;
  permissionIds: any[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Permission {
  id?: string;
  name: string;
  displayName: string;
  moduleName: string;
  createdAt?: string;
  updatedAt?: string;
}
