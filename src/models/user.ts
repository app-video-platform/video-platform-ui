export interface User {
  // id: string,
  firstName: string;
  lastName: string;
  email: string;
  role: string[]
}


export interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserLoginResponse {
  // id: string;
  firstName: string;
  lastName: string;
  email: string;
  // token: string;
  role: string[]
}