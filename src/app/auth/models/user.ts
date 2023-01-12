import { Role } from "./role";

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: Role;
  auth_toekn?: string;
}

export class Page {
  limit: number = 0;
  page: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;
}
