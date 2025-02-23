import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const TOKEN_ACCESS_SECRET_KEY = process.env.TOKEN_ACCESS_SECRET_KEY;

//   export const authenticateJWT = (req, res, next)=>{
//     console.log("Cookies received:", req.cookies);

//         const accessToken = req.cookies.accessToken;
  
//         if(!accessToken || typeof accessToken !== 'string'){
//             console.log( typeof(accessToken))
//             return res.status(401).json({message: `Unauthorized - Invalid access token format: ${typeof(accessToken)}`});
//         }
//         try {
//             const decoded = jwt.verify(accessToken, TOKEN_ACCESS_SECRET_KEY);
//             req.user = decoded;
//             next();
//         } catch (error) {
//             return res.status(401).json({ message: "Unauthorized - Invalid token"});
//         }
//     }

export const authenticateJWT = (req, res, next) => {
    console.log("🔍 Cookies received:", req.cookies);

    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        console.log("🚨 No access token found in cookies!");
        return res.status(401).json({ message: "Unauthorized - No access token" });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.TOKEN_ACCESS_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("🚨 Token verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

    export const adminMiddleware = (req, res, next) => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied - Admin only" });
        }
    };