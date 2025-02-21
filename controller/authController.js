import User from "../models/userModel.js";
import dbstorage from "../config/db.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();



export default class AuthController{
    static TOKEN_ACCESS_SECRET_KEY = process.env.TOKEN_ACCESS_SECRET_KEY;
    static REFRESH_ACCESS_SECRET_KEY = process.env.REFRESH_ACCESS_SECRET_KEY;
    static  generateAccessToken(userId, role){
        const accessToken =  jwt.sign({userId, role}, this.TOKEN_ACCESS_SECRET_KEY, {expiresIn:'1h'});
        return accessToken;
    }

    static  generateRefreshToken(userId, role){
        const refreshToken =  jwt.sign({userId, role}, this.REFRESH_ACCESS_SECRET_KEY, {expiresIn:'7d'})
        return refreshToken;
    }
    static setAccessTokenCookie(accessToken, res) {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
    }
    
    static setRefreshTokenCookie(refreshToken, res) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 1000 // 7 days
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


        if( await User.findOne( {where: {email}})){
            return {status:'error',
                message:`this email already exists`
        };
        };

        const passwordRegex =  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if(!passwordRegex.test(password)){
            return {status:'error',
                message:`password must be 8-20 characters long and contain at least one letter and one number`
        };
        };

        const hashPassword = await bcrypt.hash(password, 10);
        const createData = {
            firstName,
            lastName,
            email,
            password: hashPassword,
        };
        try {
            const user = await User.create(createData);
            return {
                status: 'success',
                message: 'user created, please log in',
            }
        } catch (error) {
            console.error('error creating user, error:',error);
            return ({status: 'error', message:"failed to create user"});
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
                message:`email or password is invailed`
        };
        };
        if (!user.password) {
            return {
              status: "error",
              message: "This account was created using Google. Please log in with Google.",
            };
          }
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return {status:'error',
                message:`email or password is invailed`
        };
        };
        const userId = user.id;
        const role = user.role;
        const accessToken= this.generateAccessToken(userId, role);
        const refreshToken = this.generateRefreshToken(userId, role);
        this.setAccessTokenCookie(accessToken, res);
        this.setRefreshTokenCookie(refreshToken, res);

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