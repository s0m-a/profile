import express from 'express'
import AuthController from '../controller/authController.js'
import User from '../models/userModel.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { authenticateJWT } from '../middleware/protectedRoute.js'

import passport from 'passport'
import session from "express-session"
import googleStrategy from 'passport-google-oauth20'
import GitHubStrategy from 'passport-github2'

dotenv.config();
const router = express.Router()
const REFRESH_ACCESS_SECRET_KEY = process.env.REFRESH_ACCESS_SECRET_KEY;


// express session setup(stores users infor across request)
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //avoid saving unchange sessions
    saveUninitialized:true //creats new session for new users
}));
router.use(passport.initialize());//Initializes Passport for authentication
router.use(passport.session()) //Enables session-based authentication.
//end of session setup

//Configure Google OIDC Strategy(callback function)
passport.use( new googleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/api/auth/google/callback"
 
},
(   accessToken, // Can be used for Google APIs if needed
    refreshToken, //Used to refresh access when expired if needed
    profile, //Contains the user's Google account details
    done //Finalizes authentication and passes the user profile
)=>{
    if (!profile || !profile.id) {
        return done(new Error("Profile is missing"), null);
    }
    const id = profile.id; // Access the ID directly from profile
    const givenName = profile.name.givenName; // Access givenName
    const familyName = profile.name.familyName; // Access familyName
    const email = profile.emails[0].value;
    return done(null, { id, givenName, familyName, email })
}))
//end of google config

passport.use( new GitHubStrategy({
    clientID : process.env.GITHUB_CLIENT_ID,
    clientSecret : process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/api/auth/github/callback",
    scope: ["read:user", "user:email"]
 
},
(   accessToken, // Can be used for Google APIs if needed
    refreshToken, //Used to refresh access when expired if needed
    profile, //Contains the user's Google account details
    done //Finalizes authentication and passes the user profile
)=>{
    const { id, username, emails, displayName } = profile;
    console.log(profile)

    // Extract first and last name(hopefully anyone loging in has a fullname on github lol)
        let fullName = displayName || ""; // Use displayName if available
        let firstName = "";
        let lastName = "";
  
        if (fullName.trim()) {
          const nameParts = fullName.split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(" ") || "";
        } else {
    // Fallback: Use GitHub username as first name
          firstName = username;
          lastName = ""; // No last name available
        }
    // Get email (GitHub may not always provide it)
    const email = emails && emails.length > 0 ? emails[0].value : null;

    return done(null, { id, username, firstName, lastName, email });
    
}))
//end of google config

//serialize and deserialize user
passport.serializeUser( (user, done)=>{ //saves user data in the session
    done(null, user)
})

passport.deserializeUser( (obj, done)=>{ //retrives user data in the session
    done(null, obj)
})
//end

//passport.authenticate redirects users to Google's login page and processing the authentication response.
router.get("/auth/google", passport.authenticate("google", { scope: ["openid", "profile", "email"] }));
router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/auth/register" }),
    async (req, res) => {
    const {  id, givenName, familyName,email } = req.user;
   const response = await AuthController.oAuthRegister(id, givenName, familyName, email, res);
           if (response.status === 'success') {
            console.log(response)
            return res.redirect("http://localhost:3000/");
        } else {
            console.error(response)
            return res.redirect("http://localhost:3000/auth/register");
        }
    }
  );


router.get("/auth/github", passport.authenticate("github", { scope: ["read:user", "user:email"] }));
router.get("/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/api/auth/register" }),
    async (req, res) => {
    const {   id, firstName, lastName, email } = req.user;
   const response = await AuthController.oAuthRegister(id, firstName, lastName, email, res);
           if (response.status === 'success') {
            console.log(response)
            return res.redirect("http://localhost:3000/");
        } else {
            console.error(response)
            return res.redirect("http://localhost:3000/auth/register");
        }
    }
  );


router.post('/auth/register', async(req, res)=>{
const {firstName, lastName, email, password} = req.body;

try {
    const response = await AuthController.registerUser({firstName, lastName, email, password});
    if(response.status === 'success'){
        return res.status(201).json(response);
    }else{
        return res.status(400).json(response);
    }
} catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({status: 'false', message: 'server error'});
}
})

// Route for user login
router.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;
    const response = await AuthController.login(email, password, res );
    if(response.status === 'success'){
        return res.status(201).json(response);
    }else{
        return res.status(400).json(response);
    }
});

// Route for refreshing access token
router.post('/auth/refresh',authenticateJWT, async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_ACCESS_SECRET_KEY);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = AuthController.generateAccessToken(user.id, user.role);
        AuthController.setAccessTokenCookie(accessToken, res);

        return res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Refresh token error:", error);
        if (!res.headersSent) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
    }
});

router.get("/auth/profile", authenticateJWT, async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});



router.post('/auth/logout', (req, res) => {
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ message: "Logged out successfully" });
});


    export default router;