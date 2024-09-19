import express from 'express';
import { createTeacher,updateTeacher,deleteTeacher,getTeacher,getTeachers,getIdByName,getTeachersForm,getTeacherSalariesSum} from '../controllers/teacher.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { authorize } from '../utils/verifyUser.js';
const router = express.Router();

router.use(verifyToken);


router.post('/create', authorize(['admin']), createTeacher);
router.post('/update/:id',authorize(['teacher','admin']),updateTeacher);
router.delete('/delete/:id',authorize(['admin']),deleteTeacher);
router.get('/get',authorize(['student','teacher','admin']),getTeachers);
router.get('/get/:id',authorize(['student','teacher','admin']),getTeacher);
router.get('/getIdByName/:name',authorize(['teacher','admin']),getIdByName);
router.get('/getForm/:id',authorize(['teacher','admin']),getTeachersForm);
router.get('/getForm',authorize(['admin']),getTeachersForm);
router.get('/getTeacherSalariesSum',authorize(['teacher','admin']),getTeacherSalariesSum);

export default router;