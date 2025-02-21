import express from 'express'
import {authenticateJWT, adminMiddleware} from '../middleware/protectedRoute.js'
import ManagerController from "../controller/managerController.js";
import checkRole from '../middleware/roleMiddleware.js';
const router = express.Router();

router.use(authenticateJWT, checkRole('manager'));

router.get('/dashboard/allUsers',async (req, res)=>{
        try {
        const userId = req.user.userId;
        const response = await ManagerController.viewAssignedUser(userId);
        res.status(response.status === 'success' ? 200 : 500).json(response);
    } catch (error) {
        console.error('server error:', error);
        res.status(500).json({status: 'false', message: 'server error'});
    }
})


router.delete('/dashboard/deleteUser',async (req, res)=>{
    try {
    const {userId} = req.body;
    const response = await ManagerController.deleteUserbyId(userId);
    res.status(response.status === 'success' ? 200 : 500).json(response);
} catch (error) {
    console.error('server error:', error);
    res.status(500).json({status: 'false', message: 'server error'});
}
})


export default router;
