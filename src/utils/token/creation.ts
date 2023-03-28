import jwt  from "jsonwebtoken";
import IUser from "../interfaces/user.interface";

const createToken  = (id : string, email : string) => {
    const token = jwt.sign({ userId: id, email }, process.env.TOKEN_SECRET as jwt.Secret, { expiresIn: "7d" });
    return token;
}

export default createToken;