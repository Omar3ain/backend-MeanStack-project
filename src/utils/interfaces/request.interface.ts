import { Request } from "express";
import IUser from "@/utils/interfaces/user.interface";

interface CustomRequest extends Request {
  user?: IUser;
  admin? : IUser;
}

export default CustomRequest;