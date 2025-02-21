import User from "../models/userModel.js";

export default class ManagerController{

    static async viewAssignedUser(managerId){
        try {
            const manager = await User.findByPk(managerId);
            const role = manager.role;
            if(!manager || role !== 'manager' && role !== 'admin'){
                return {
                    status: 'error',
                    message: 'manager does not exist'
                };
            }
            const users = await User.findAll( {where: {managerId : managerId},
            attributes: {exclude: ['password']}});
            if(!users.length){
                return {
                    status: 'error',
                    message: 'No users found for this manager'
                };
            }
            return {
                status: 'success',
                message: 'Users assigned retrieved successfully',
                data:users
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Error retrieving users',
                error: error.message,
            };  
        }
    }

    static async deleteUserbyId(userId){
        try {
            const user = await User.findByPk(userId);
            if(!user){
                return {
                    status:'error',
                    message:"user not found"
            }
            }
            await user.destroy();
            return {
                status: 'success',
                message: 'User deleted successfully',
            };
        } catch (error) {
            return{
                status: 'error',
                message: 'Error deleting user',
                error: error.message,

            }
        }
    }
}