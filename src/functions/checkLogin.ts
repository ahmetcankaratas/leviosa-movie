import { User } from '../entity/User';
import { Request } from 'express';
import * as google from '../controllers/auth.google';
import * as facebook from '../controllers/auth.facebook';

export const user = async function (req: Request) {
  if (req.session.userID) {
    const user = await User.findOne({
      id: req.session.userID,
    });
    return user;
  } else {
    return { user: null, google: google.loginUrl(), facebook: facebook.loginUrl() };
  }
};
