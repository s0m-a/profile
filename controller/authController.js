import dotenv from 'dotenv';
dotenv.config();
import User from "../models/userModel.js";
import dbstorage from "../config/db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



export default class AuthController{
    static TOKEN_ACCESS_SECRET_KEY = process.env.TOKEN_ACCESS_SECRET_KEY;
    static REFRESH_ACCESS_SECRET_KEY = process.env.REFRESH_ACCESS_SECRET_KEY;
 
    static generateAccessToken(userId, role) {
        if (!this.TOKEN_ACCESS_SECRET_KEY) {
            throw new Error("TOKEN_ACCESS_SECRET_KEY is not set in environment variables");
        }
        const accessToken = jwt.sign(
            { userId, role }, 
            this.TOKEN_ACCESS_SECRET_KEY, 
            { algorithm: 'HS256', expiresIn: '1h' } )
        return accessToken;
    }
    

    static  generateRefreshToken(userId, role){
        if (!this.REFRESH_ACCESS_SECRET_KEY) {
            throw new Error("REFRESH_ACCESS_SECRET_KEY is not set in environment variables");
        }
        const refreshToken =  jwt.sign({userId, role}, this.REFRESH_ACCESS_SECRET_KEY,  { algorithm: 'HS256', expiresIn: '1h' })
        return refreshToken;
    }

    static setAccessTokenCookie(accessToken, res) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true, 
            sameSite: "lax",
            path: "/",
            domain: ".onrender.com",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        
        console.log("✅ Set Cookie: accessToken=", accessToken);
    }
    

    static  setRefreshTokenCookie(refreshToken, res) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None", // Required for cross-site cookies
            domain: ".onrender.com",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    static async registerUser(data){

        const {firstName, lastName, email,password} = data;
        for(const key of ["firstName", "lastName","email","password"]){
            if(!data[key]){
                return {status:'error',
                        message:`${key} field is required`
                }
            }
        };


        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return { status: "error", message: "This email already exists" };
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if (!passwordRegex.test(password)) {
            return { status: "error", message: "Password must be 8-20 characters long and contain at least one letter and one number" };
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            return { status: "success", message: "User created successfully. Please log in." };
        } catch (error) {
            console.error("❌ Error creating user:", error);
            return { status: "error", message: "Failed to create user" };
        }
    }

    static async login(email, password,res){
        if (!email) {
            return { status: "error", message: "Email field is required" };
        }
        if (!password) {
            return { status: "error", message: "Password field is required" };
        }

        const user = await User.findOne( {where: {email}});
        if(!user){
            return {status:'error',
                message: "Invalid email or password"
        };
        };
        if (!user.password) {
            return {
              status: "error",
              message: "This account was created using Google. Please log in with Google.",
            };
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
              return { status: "error", message: "Invalid email or password" };
          }
        const userId = user.id;
        const role = user.role;
        const accessToken = AuthController.generateAccessToken(userId, role);
        const refreshToken = AuthController.generateRefreshToken(userId, role);
        AuthController.setAccessTokenCookie(accessToken, res);
        AuthController.setRefreshTokenCookie(refreshToken, res);
        console.log("🔑 Access Token:", accessToken);
        console.log("🔑 Refresh Token:", refreshToken);
    
        console.log("✅ Cookies Set, Sending Response...");

        return ({ status: 'success', 
            message: `Welcome back ${user.firstName},`,user
        });
    }

static async me(userId){
    try {
        const user = await User.findByPk(userId);
        if(!user){
            return {
            status:'error',
            messsage:`please log in`
            }
        }
        return {
            status: 'success',
            message:`you are a ${user.role}`, user
        }
      } catch (error) {
        return {
            status:'error',
            messsage:`error: ${error}`, 
    };
      }
}

static async oAuthRegister(id, givenName, familyName,email, res){
    try {
        console.log(`id: ${id}`)
        const user = await User.findOne( {where: {email}});
        if(user){
        // If the user exists but oAuthId is not set, update the record
        if(!user.oAuthId){
            user.oAuthId = id;
            const userId = user.id;
            const role = user.role;
            console.log(user)
            await user.save();
            const accessToken= generateAccessToken(userId, role);
            const refreshToken = generateRefreshToken(userId, role);
            setAccessTokenCookie(accessToken, res);
            setRefreshTokenCookie(refreshToken, res);
            return {
                status: 'success',
                message: 'user registered, welcome',
            } 
        }else {
            // If the user exists and oAuthId is already set
            const userId = user.id;
            const role = user.role;
            const accessToken = generateAccessToken(userId, role);
            const refreshToken = generateRefreshToken(userId, role);
            setAccessTokenCookie(accessToken, res);
            setRefreshTokenCookie(refreshToken, res);

            return {
                status: 'success',
                message: `welcome back ${user.firstName}`,
            };
        }}else{
            const creatData = {
                firstName : givenName,
                lastName: familyName,
                email:email,
                googleId: id,
            }
            const newUser = await User.create(creatData);
            const userId = newUser.id;
            const role = newUser.role;
            const accessToken= generateAccessToken(userId, role);
            const refreshToken = generateRefreshToken(userId, role);
            setAccessTokenCookie(accessToken, res);
            setRefreshTokenCookie(refreshToken, res);
            return {
                status: 'success',
                message: 'user registered, please log in',
            }
        }
    } catch (error) {
        console.error('error creating user, error:',error);
        return ({status: 'error', message:"failed to register user"});
    }
}

} 