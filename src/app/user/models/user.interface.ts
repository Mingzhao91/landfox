export interface User {
  _id: string;
  email: string;
  passwordHash?: string; // retrieve
  password?: string; // update/create
  isAdmin: boolean;
}

export interface UserLoginResponse {
  token: string;
  user: string;
  isAdmin: boolean;
}
