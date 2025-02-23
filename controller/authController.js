import User from "../models/userModel.js";
import dbstorage from "../config/db.js";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config({ path: './.env' });

const TOKEN_ACCESS_SECRET_KEY ="your_secret_key";
const REFRESH_ACCESS_SECRET_KEY = process.env.REFRESH_ACCESS_SECRET_KEY;

export default class AuthController{
    static generateAccessToken(userId, role) {
        console.log("🔑 Signing Token with Secret Key:", `"${TOKEN_ACCESS_SECRET_KEY}"`);
        return jwt.sign({ userId, role }, TOKEN_ACCESS_SECRET_KEY, { expiresIn: "1h" });
    }
    

    static  generateRefreshToken(userId, role){
        const refreshToken =  jwt.sign({userId, role}, REFRESH_ACCESS_SECRET_KEY, {expiresIn:'7d'})
        return refreshToken;
    }

    static setAccessTokenCookie(accessToken, res) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure:true,
            sameSite: "None", // Required for cross-site cookies
            path: "/",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    }
    

    static setRefreshTokenCookie(refreshToken, res) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
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
        const role = user.role || "user";;
        const accessToken= this.generateAccessToken(userId, role);
        const refreshToken = this.generateRefreshToken(userId, role);
        this.setAccessTokenCookie(accessToken, res);
        this.setRefreshTokenCookie(refreshToken, res);
        console.log("🔑 Access Token:", accessToken);
        console.log("🔑 Refresh Token:", refreshToken);
    
        this.setAccessTokenCookie(accessToken, res);
        this.setRefreshTokenCookie(refreshToken, res);
    
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
            const accessToken= this.generateAccessToken(userId, role);
            const refreshToken = this.generateRefreshToken(userId, role);
            this.setAccessTokenCookie(accessToken, res);
            this.setRefreshTokenCookie(refreshToken, res);
            return {
                status: 'success',
                message: 'user registered, welcome',
            } 
        }else {
            // If the user exists and oAuthId is already set
            const userId = user.id;
            const role = user.role;
            const accessToken = this.generateAccessToken(userId, role);
            const refreshToken = this.generateRefreshToken(userId, role);
            this.setAccessTokenCookie(accessToken, res);
            this.setRefreshTokenCookie(refreshToken, res);

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
            const accessToken= this.generateAccessToken(userId, role);
            const refreshToken = this.generateRefreshToken(userId, role);
            this.setAccessTokenCookie(accessToken, res);
            this.setRefreshTokenCookie(refreshToken, res);
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