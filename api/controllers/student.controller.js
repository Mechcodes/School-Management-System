import Student from '../models/student.model.js';
import Class from '../models/class.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const createStudent = async (req, res, next) => {
  console.log(req.body);
  const { name,email} = req.body;
  const hashedPassword = bcryptjs.hashSync("12345", 10);
  const newUser = new User({ 
    username: name, 
    email,
    password: hashedPassword, 
    role: 'student'
  });
    await newUser.save();
  try {
    const className = req.body.class;

    const foundClass = await Class.findOne({ name: className });

    
    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    
    if (foundClass.currentCapacity >= foundClass.maxCapacity) {
      return res.status(400).json({ message: 'Class is full. Cannot add more students.' });
    }

   
    const newStudent = await Student.create({
      ...req.body,
      class: foundClass._id,
      userId: newUser._id
    });

   
    foundClass.students.push(newStudent._id);
    foundClass.currentCapacity++;
    await foundClass.save();
    
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
   
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    
    await Student.findByIdAndDelete(req.params.id);

    
    const foundClass = await Class.findOneAndUpdate(
      { students: req.params.id },
      { $pull: { students: req.params.id } },
      { new: true }
    );

    if (!foundClass) {
      return res.status(404).json({ message: 'Associated class not found' });
    }

    res.status(200).json({ message: 'Student has been deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  const student= await Student.findById(req.params.id);
  if (!student) {
    return next(errorHandler(404, 'Student not found!'));
  }
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  // console.log("requestUser" , req.user);
  if (req.user.role == 'student') {

    const currStudent = await Student.findOne({ userId: req.user.id })

    if(currStudent._id != req.params.id) {
      return errorHandler(403, 'You can only update your own details');
    }
  }
  try {
    const student = await Student.findById(req.params.id).populate("class");
    
    if (!student) {
      return next(errorHandler(404, 'Student not found!'));
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req, res, next) => {
  if (req.user.role == 'student' ) {
    try {
      const students = await Student.find({ userId: req.user.id }).populate("class")
      return res.status(200).json(students);
    } catch (error) {
      next(error);
    }
}
  try {
    const students = await Student.find().populate("class")
    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};
export const getIdByName = async (req, res, next) => {
  try {
    const studentName = req.params.name;
    const studentData = await Student.findOne({ name: studentName });
    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json( studentData._id );
  } catch (error) {
    next(error);
  }
};
export const getStudentsForm = async (req, res, next) => {
  if(req.params.id==null){
    try {
      const students = await Student.find({}, { _id: 0,__v:0,createdAt:0,updatedAt:0,role:0,userId:0,});
      return res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }
  console.log(req.params);
  if (req.user.role == 'student') {
    const student = await Student.findOne({ _id: req.params.id });
    console.log(req.user.id); 
    console.log(req.params);
    if(student == null || student.userId != req.user.id)
    return next(errorHandler(403, 'You can only update your own details'));
}
  try {
    const students = await Student.find({_id: req.params.id}, { _id: 0,__v:0,createdAt:0,updatedAt:0,role:0,userId:0,});
    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

export const getStudentFeesSum = async (req, res, next) => {
  try {
    const result = await Student.aggregate([
      {
        $group: {
          _id: null,
          sum: { $sum: "$feesPaid" }
        }
      }
    ]);

    if (result.length > 0) {
      res.status(200).json({ sum: result[0].sum });
    } else {
      res.status(200).json({ sum: 0 }); 
    }
  } catch (error) {
    next(error); 
  }
};

