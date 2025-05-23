declare namespace Express {
  interface UserObject {
    id: string;
    role: string;
    exp: number;
    iat: number;
  }
  export interface Request {
    user: UserObject;
  }

  export interface Response {
    user?: { id: string; role: string };
  }
}
