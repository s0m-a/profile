import express from 'express'
import {authenticateJWT, adminMiddleware} from "../middleware/protectedRoute.js"
import AdminController from '../controller/adminController.js';
import checkRole from '../middleware/roleMiddleware.js';
const router = express.Router();
router.use(authenticateJWT, checkRole('admin'),adminMiddleware);

router.get('/dashboard/allUsers',async (req, res)=>{
        try {
        const response = await AdminController.getAllUsers();
        res.status(response.status === 'success' ? 200 : 500).json(response);
    } catch (error) {
        console.error('server error:', error);
        res.status(500).json({status: 'false', message: 'server error'});
    }
})


router.post('/dashboard/assignManager',async (req, res)=>{
    try {
        const {userId, managerId} = req.body;
    const response = await AdminController.assignManager({userId, managerId});
    if(response.status === 'success'){
        res.status(201).json(response);
        return response.message;
    }else{
        res.status(400).json(response);
        return response.message;
    }
} catch (error) {
    console.error('server error:', error);
    res.status(500).json({status: 'false', message: 'server error'});
}
})

router.get('/dashboard/usersWithManager',async (req, res)=>{
    try {
        const {userId, managerId} = req.body;
    const response = await AdminController.getUsersWithManagers({userId, managerId});
    res.status(response.status === 'success' ? 200 : 500).json(response);
} catch (error) {
    console.error('server error:', error);
    res.status(500).json({status: 'false', message: 'server error'});
}
})

export default router;