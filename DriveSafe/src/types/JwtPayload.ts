import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  "userId": string,
  "sub": string,
  "iat": number,
  "exp": number
}
