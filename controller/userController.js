import User from "../models/userModel.js";
import dbstorage from "../config/db.js";
import { Op } from 'sequelize';

export default  class UserController{

    static async viewProfile(userId){
        const user = await User.findByPk(userId);
        if(!user){
            return {status:'error',
                messsage:"user not found, please log in"
        }
    }
            return {status:'success',
            messsage:`user found`,
            data:{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }
    }

    static async updateProfile(data){
        const {userId, firstName, lastName, email} = data;
        for(const key of ["firstName", "lastName", "email"]){
            if(!data[key]){
                return {status:'error',
                        message:`${key} field is required`
                }
            }
        };
        const user = await User.findByPk(userId);
        if(!user){
            return {
                status:'error',
                message:"user not found, please log in"
                }
    }
    const checkEmail = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
    if(checkEmail){
        return {
            status:'error',
            message:"this email already exits, chose another"
            }
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await user.save();
    return {status:'success',
        message:`user profile updated`,
    }
}








}
