import { Request, Response } from 'express';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as validation from '../validations/validation';
import config from '../config/config';

// Create User
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Validate before we send the information to DB
  const { error } = validation.register(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Check if user already in the DB
  const userNameCheck = await User.findOne({
    userName: username,
  });
  if (userNameCheck) {
    return res.status(400).json({ errors: 'User name already registered' });
  }

  // Check if email already in the DB
  const userEmailCheck = await User.findOne({
    email: email,
  });
  if (userEmailCheck) {
    return res.status(400).json({ errors: 'Email already registered' });
  }

  // Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = new User();
  user.userName = username;
  user.email = email;
  user.password = hashed;
  user.auth = 'local';

  //Save new user to the database
  try {
    await User.save(user);
    res.status(200).json({ message: 'User is created succesfully' });
  } catch (error) {
    throw new Error();
  }
};

// Local Authentication
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate before we send the information to DB
  const { error } = validation.login(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Check if the user name exists in the DB
  let user;
  try {
    user = await User.findOneOrFail({
      userName: username,
    });
  } catch (error) {
    res
      .status(400)
      .json({ errors: "User name doesnt't exists in the Database" });
  }

  // Check if the password is correct
  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return res.status(400).json({ errors: 'incorrect password' });
  } else {
    //Create session
    req.session.browserInfo = req.headers['user-agent'];
    req.session.userID = user.id;

    //Create token
    const token = jwt.sign(
      { userID: user.id, browserInfo: req.headers['user-agent'] },
      config.jwt,
      {
        expiresIn: '1h',
      }
    );

    //Send jwt to cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
    res.status(200).json({ user: true });
  }
};

// Destroy Session
export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      throw new Error(err);
    } else {
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('jwt');
      res.redirect('/');
    }
  });
};
