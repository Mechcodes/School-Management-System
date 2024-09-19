import express from 'express';
import { updateStudent,deleteStudent,getStudent,getStudents,createStudent,getIdByName,getStudentsForm,getStudentFeesSum} from '../controllers/student.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { authorize } from '../utils/verifyUser.js';
const router = express.Router();

router.use(verifyToken);

router.post('/create', authorize(['teacher','admin']), createStudent);
router.post('/update/:id',authorize(['teacher','admin','student']),updateStudent);
router.delete('/delete/:id',authorize(['admin','teacher']),deleteStudent);
router.get('/get',authorize(['teacher','admin','student']),getStudents);
router.get('/get/:id',authorize(['teacher','admin','student']),getStudent);
router.get('/getIdByName/:name',authorize(['teacher','admin','student']),getIdByName);
router.get('/getForm/:id',authorize(['teacher','admin','student']),getStudentsForm);
router.get('/getForm',authorize(['teacher','admin','student']),getStudentsForm);
router.get('/getStudentFeesSum',authorize(['teacher','admin','student']),getStudentFeesSum)
export default router;