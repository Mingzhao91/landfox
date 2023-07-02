export interface User {
  _id: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface UserLoginResponse {
  token: string;
  user: string;
  isAdmin: boolean;
}
