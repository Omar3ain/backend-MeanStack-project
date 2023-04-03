import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "@/models/User";
import httpException from "@/utils/exceptions/http.exception";

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            next(new httpException(401, "Not authorized, no token provided!"));
        }
        const decoded: string | JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret) as JwtPayload;
        const user = await User.findById(decoded.userId);
        if (user) {
            if (!user.isAdmin) {
                (<any>req).user = user;
                next();
            } else {
                next(new httpException(401, "You are not a user"));
            }
        } else {
            next(new httpException(401, "user doesn't exist, Invalid!"));
        }
    } catch (err) {
        next(new httpException(401, "Access denied, Invalid token!"));
    }

}

export default verifyAuth;