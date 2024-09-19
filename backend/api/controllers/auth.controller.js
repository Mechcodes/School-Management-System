import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

export const signup = async (req, res, next) => {
  const { username,role, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username,role, email, password: hashedPassword });
  try {
    await newUser.save();

    if(role=='student'){
      const student = new Student({name:username,userId:newUser._id,email: email});
      await student.save();
    }else if(role=='teacher'){
      const teacher = new Teacher({name:username,userId:newUser._id,email: email});
      await teacher.save();
    }
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id,role: validUser.role }, process.env.JWT_SECRET);
    const {password: pass, ...rest } = validUser._doc;
    rest.access_token = token;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

