import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import { Request, Response, NextFunction } from "express";
import httpException from "@/utils/exceptions/http.exception";

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            next(new httpException(401, "Not authorized, no token provided!"));
        }
        const decoded: string | JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret) as JwtPayload;
        const admin = await User.findById(decoded.userId);
        if (admin) {
            if (admin.isAdmin) {
                (<any>req).admin = admin;
                next();
            }
        }else{
            next(new httpException(401, "Admin doesn't exist, Invalid!"));
        }
    }catch(err){
        next(new httpException(401, "Access denied, Invalid token!"));
    }

}

export default verifyAdmin;