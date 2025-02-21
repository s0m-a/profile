import roles from "../models/role.js";

export default function checkRole(role){
   return (req, res, next) =>{
    const userRole = req.user.role;
    if(!roles[userRole]?.includes(role)){
        return res.status(401).json({message:`Unauthorized access,this route is for ${role} but youre a ${userRole}`});
    }
    next();
   }
}

