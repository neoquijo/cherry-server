export interface ICreateUserDto {
  id: string;
  login?: string;
  password?: string;
  email: string;
  phone?: string;
  avatar?: string;
  firstname?: string;
  lastname?: string;
  displayName?: string;
  authProvider: string;
  emailVerified?: boolean;
}
