import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const TOKEN_ACCESS_SECRET_KEY ="your_secret_key";
console.log(` token secret: ${TOKEN_ACCESS_SECRET_KEY}`)
  export const authenticateJWT = (req, res, next)=>{
    console.log("Cookies received:", req.cookies);

    const accessToken = req.cookies.accessToken || req.cookies.token;
  
        if(!accessToken || typeof accessToken !== 'string'){
            console.log( typeof(accessToken))
            return res.status(401).json({message: `Unauthorized - Invalid access token format: ${typeof(accessToken)}`});
        }
        try {
            console.log("Token being verified:", accessToken);
            console.log("Secret Key:", TOKEN_ACCESS_SECRET_KEY);
            console.log("Decoded Token:", jwt.decode(accessToken));
            console.log("🔑 Verifying Token with Secret Key:", TOKEN_ACCESS_SECRET_KEY);
            const decoded = jwt.verify(accessToken, TOKEN_ACCESS_SECRET_KEY);
            console.log("Decoded Token:", jwt.decode(accessToken));

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized - Invalid token here"});
        }
    }

// export const authenticateJWT = (req, res, next) => {
//     console.log("🔍 Cookies received:", req.cookies);

//     const accessToken = req.cookies?.accessToken;

//     if (!accessToken) {
//         console.log("🚨 No access token found in cookies!");
//         return res.status(401).json({ message: "Unauthorized - No access token" });
//     }

//     try {
//         const decoded = jwt.verify(accessToken, process.env.TOKEN_ACCESS_SECRET_KEY);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.log("🚨 Token verification failed:", error.message);
//         return res.status(401).json({ message: "Unauthorized - Invalid token" });
//     }
// };

    export const adminMiddleware = (req, res, next) => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied - Admin only" });
        }
    };