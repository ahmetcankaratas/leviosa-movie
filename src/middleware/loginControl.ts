import { Request, Response, NextFunction } from 'express';

//Check the user if logged in, don't allow to react login or register page
const loginControl = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.session.userId) {
      return res.redirect('/');
    }
    next();
  } catch (err) {
    res.status(400).render('login', { message: err, login: false });
  }
};

export default loginControl;
