import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function signJwt(payload: object) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.log("jwtError", error)
        return null;
    }
}
