import express from 'express';
import { deleteClass,updateClass,getClass,getClasses,createClass, getClassByName,getIdByName,getClassesForm} from '../controllers/class.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { authorize } from '../utils/verifyUser.js';
const router = express.Router();

router.use(verifyToken);

router.post('/create', authorize(['admin']), createClass);
router.post('/update/:id',authorize(['teacher','admin']),updateClass);
router.delete('/delete/:id',authorize(['admin']),deleteClass);
router.get('/get',authorize(['student','teacher','admin']),getClasses);
router.get('/get/:id',authorize(['student','teacher','admin']),getClass);
router.get('/getByName/:name',authorize(['teacher','admin']),getClassByName);
router.get('/getIdByName/:name',authorize(['teacher','admin']),getIdByName);
router.get('/getForm',authorize(['admin']),getClassesForm);

export default router;