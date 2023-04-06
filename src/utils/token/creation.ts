import jwt from "jsonwebtoken";

const createToken = (id: string, email: string, isAdmin: boolean) => {
    const token = jwt.sign({ userId: id, email }, process.env.TOKEN_SECRET as jwt.Secret, { expiresIn: "7d" });
    return {token, isAdmin};
}

export default createToken;