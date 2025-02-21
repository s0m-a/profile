import User from "../models/userModel.js"
export default class AdminController{

    static async  getAllUsers(){
        try {
            const users = await User.findAll({
                attributes: {
                    exclude: ['password', 'oAuthId'], // Exclude the password field
                },
            });
            return{
                status: 'success',
                message: "users retrieved",
                data: users  
            };

        } catch (error) {
            return {
                status: 'error',
                message: 'Error retrieving users',
                error: error.message
            };

        }
    }

    static async assignManager (data){
        const {userId, managerId} = data;
        if(!userId || !managerId){
            return {
                status: 'error',
                message: 'User ID and Manager ID are required',
            };
        }
    
        try {
            const user = await User.findByPk(userId);
            const manager = await User.findByPk(managerId);
            if(!user || !manager){
                return {
                    status: 'error',
                    message: 'User or Manager not found',
                };
            }

            // Check if the manager's role is "manager"
            if (manager.role !== 'manager') {
            return {
             status: 'error',
             message: 'The assigned user is not a manager',
                 };
             }
            user.managerId = managerId;
            await user.save();
            return {
                status: 'success',
                message: 'Manager assigned successfully.', user
            };
            
        } catch (error) {
            return {
                status: 'error',
                message: 'Error assigning manager',
                error: error.message
            };
        }
    }

    static async getUsersWithManagers() {
        try {
            const users = await User.findAll();
            const usersWithManagers = await Promise.all(
                users.map( async (user)=>{
                    if(user.role === 'user'){
                    const manager = user.managerId ? await User.findByPk(user.managerId) : null;
                    return{
                        id: user.id,
                        name: user.firstName+ ' ' + user.lastName,
                        email: user.email,
                        role: user.role,
                        manager: manager ? {id: manager.id, 
                                            name: manager.firstName+ ' ' + manager.lastName}: 'No manager assigned',
                    };
                }})
            );
            // Filter out any undefined values (for users who were not 'user' roles)
            const filteredUsers = usersWithManagers.filter(user => user !== undefined);
            return {
                status: 'success',
                message: 'Users retrieved successfully',
                data: filteredUsers,
            };
            
        } catch (error) {
            return {
                status: 'error',
                message: 'Error retrieving users',
                error: error.message,
            };    
        }
    }
}

