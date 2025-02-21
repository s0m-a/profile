import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const TOKEN_ACCESS_SECRET_KEY = process.env.TOKEN_ACCESS_SECRET_KEY;

  export const authenticateJWT = (req, res, next)=>{
        const accessToken = req.cookies.accessToken;
  
        if(!accessToken || typeof accessToken !== 'string'){
            return res.status(401).json({message: "Unauthorized - Invalid access token format"});
        }
        try {
            const decoded = jwt.verify(accessToken, TOKEN_ACCESS_SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized - Invalid token"});
        }
    }
    export const adminMiddleware = (req, res, next) => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied - Admin only" });
        }
    };