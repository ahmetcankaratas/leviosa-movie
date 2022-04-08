import * as queryString from 'query-string';
import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config/config';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';

// Google Login URL
export const loginUrl = () => {
  const stringifiedParams = queryString.stringify({
    client_id: config.googleId,
    redirect_uri: 'http://localhost:3000/auth/google',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
};

// Google Authentication
export const auth = async (req: Request, res: Response) => {
  // Get access token from google
  const code = req.query.code as string;

  async function getAccessTokenFromCode(code) {
    const { data } = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: config.googleId,
        client_secret: config.googleSecret,
        redirect_uri: 'http://localhost:3000/auth/google',
        grant_type: 'authorization_code',
        code,
      },
    });
    return data.access_token;
  }

  // Get user info
  const access_token = await getAccessTokenFromCode(code);

  async function getGoogleUserInfo(access_token) {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return data;
  }

  // Login via google
  const userdata = await getGoogleUserInfo(access_token);

  try {
    const user = await User.findOne({
      where: {
        email: userdata.email,
      },
    });

    if (user) {
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
      res.redirect('/');
    } else {
      // Create new user
      const newUser = new User();
      newUser.userName = userdata.name;
      newUser.email = userdata.email;
      newUser.password = '';
      newUser.auth = 'google';

      //Save new user to the database
      const saveUserData = await User.save(newUser);

      //Create session
      req.session.browserInfo = req.headers['user-agent'];
      req.session.userID = saveUserData.id;

      //Create token
      const token = jwt.sign(
        { userID: saveUserData.id, browserInfo: req.headers['user-agent'] },
        config.jwt,
        {
          expiresIn: '1h',
        }
      );
      //Send jwt to cookie
      res.cookie('jwt', token, { httpOnly: true, maxAge: 90000 });
      res.redirect('/');
    }
  } catch (error) {
    throw new Error();
  }
};
