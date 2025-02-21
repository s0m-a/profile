import express from 'express'
import UserController from "../controller/userController.js" 
import {authenticateJWT, adminMiddleware} from '../middleware/protectedRoute.js'
import checkRole from '../middleware/roleMiddleware.js';
const router = express.Router();

router.use(authenticateJWT, checkRole('user'));

router.get('/user/veiwProfile', async (req, res)=>{
    const userId = req.user.userId;
    try {
    const response = await UserController.viewProfile(userId);
    if(response.status === 'success'){
        res.status(201).json(response);
        return response.messsage;
    }else{
        res.status(400).json(response);
        return response.messsage;
    }
} catch (error) {
    console.error('server error:', error);
    res.status(500).json({status: 'false', message: 'server error'});
}

})

router.put('/user/updateProfile', async (req, res)=>{
    const userId = req.user.userId;
    const { firstName, lastName, email} = req.body;
    try {
    const response = await UserController.updateProfile({userId,firstName, lastName, email});
    if(response.status === 'success'){
        res.status(201).json(response);
        return response.messsage;
    }else{
        res.status(400).json(response);
        return response.messsage;
    }
} catch (error) {
    console.error('server error:', error);
    res.status(500).json({status: 'false', message: 'server error'});
}

})

export default router;