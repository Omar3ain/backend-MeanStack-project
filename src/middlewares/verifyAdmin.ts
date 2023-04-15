import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "@/models/User";
import httpException from "@/utils/exceptions/http.exception";
import CustomRequest from "@/utils/interfaces/request.interface";

const verifyAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            next(new httpException(401, "Not authorized, no token provided!"));
        }
        const decoded: string | JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret) as JwtPayload;
        const admin = await User.findById(decoded.userId);
        if (admin) {
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpirationTime = (decoded.exp as number) * 86400;
            if (tokenExpirationTime < currentTime) {
                next(new httpException(401, "Access denied, Token has expired!"));
            } else {
                if (admin.isAdmin) {
                    req.admin = admin;
                    next();
                } else {
                    next(new httpException(401, "You are not an Administrator"));
                }
            }
        } else {
            next(new httpException(401, "Admin doesn't exist, Invalid!"));
        }
    } catch (err) {
        next(new httpException(401, "Access denied, Invalid token!"));
    }
}

export default verifyAdmin;