import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

//To protect our routes we add middleware
export const checkJwt = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check JWT
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).render('401', {
      errors: "You don't have JWT Token-Access Denied",
    });
  }

  // Check Session
  const session = req.session;
  if (!session.userID) {
    return res.status(401).render('401', {
      errors: "You don't have Session ID-Access Denied",
    });
  }

  jwt.verify(token, config.jwt, async (err: any, decoded: any) => {
    if (
      decoded.browserInfo == session.browserInfo &&
      req.headers['user-agent'] == decoded.browserInfo
    ) {
      next();
    } else {
      res
        .status(401)
        .render('401', { errors: 'Invalid Token or Session-Access Denied' });
    }
  });
};
