export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: string;
  empId: string;
}

export interface UserOptional {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role?: string;
  empId: string;
}
