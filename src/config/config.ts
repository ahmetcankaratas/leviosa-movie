// All Configuration
import dotenv from 'dotenv';
dotenv.config();

const SESSION = process.env.SESSION_SECRET || 'de';

const TOKEN = process.env.TOKEN_SECRET || '';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;

const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

const config = {
  session: SESSION,
  jwt: TOKEN,
  googleId: GOOGLE_CLIENT_ID,
  googleSecret: GOOGLE_CLIENT_SECRET,
  facebookId: FACEBOOK_CLIENT_ID,
  facebookSecret: FACEBOOK_CLIENT_SECRET,
};

export default config;
