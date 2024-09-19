import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gender: {
    type: String,
    default:""
  },
  dob: {
    type: Date,
    default:""
  },
  email: {
    type: String,
    required: true,
  },
  Salary: {
    type: Number,
    default:""
  },
  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  role: {
    type: String,
    default: "Teacher"
    },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
