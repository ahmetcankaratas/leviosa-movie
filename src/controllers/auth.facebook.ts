import * as queryString from 'query-string';
import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config/config';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';

// Facebook Login URL
export const loginUrl = () => {
  const stringifiedParams = queryString.stringify({
    client_id: config.facebookId,
    redirect_uri: 'http://localhost:3000/auth/facebook/',
    scope: ['email'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  });

  return `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
};

// Facebook Authentication
export const auth = async (req: Request, res: Response) => {
  // Get access token from facebook
  const code = req.query.code as string;

  async function getAccessTokenFromCode(code) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: config.facebookId,
        client_secret: config.facebookSecret,
        redirect_uri: 'http://localhost:3000/auth/facebook/',
        code,
      },
    });
    console.log(data); // { access_token, token_type, expires_in }
    return data.access_token;
  }

  // Get user info
  const access_token = await getAccessTokenFromCode(code);

  async function getFacebookUserData(access_token) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: access_token,
      },
    });
    console.log(data); // { id, email, first_name, last_name }
    return data;
  }

  // Login via google
  let userdata = await getFacebookUserData(access_token);

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
      res.cookie('jwt', token, { httpOnly: true, maxAge: 90000 });
      res.redirect('/');
    } else {
      // Create new user
      const newUser = new User();
      newUser.userName = userdata.first_name;
      newUser.email = userdata.email;
      newUser.password = '';
      newUser.auth = 'facebook';

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
      res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
      res.redirect('/');
    }
  } catch (error) {
    throw new Error();
  }
};
